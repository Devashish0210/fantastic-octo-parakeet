import { tool } from "ai";
import { z } from "zod";
import axios from "axios";

// ============== TOOL ERROR HANDLING UTILITY ==============

/**
 * Wraps tool execution in try-catch with timeout
 * Returns structured error objects that the LLM can understand
 */
async function safeToolExecution(toolName, executionFn, timeoutMs = 15000) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`${toolName} timed out after ${timeoutMs}ms`)), timeoutMs)
  );

  try {
    const result = await Promise.race([executionFn(), timeoutPromise]);
    return result;
  } catch (error) {
    console.error(`❌ [${toolName}] Tool execution failed:`, error);

    // Categorize the error
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 403) {
          return {
            status: "AUTH_FAILED",
            message: "Your session has expired. Please log in again.",
            error_code: 403,
          };
        } else if (error.response.status >= 500) {
          return {
            status: "SERVER_ERROR",
            message: "The service is temporarily unavailable. Please try again in a moment.",
            error_code: error.response.status,
          };
        } else {
          return {
            status: "ERROR",
            message: `Request failed with status ${error.response.status}. Please try again.`,
            error_code: error.response.status,
          };
        }
      } else if (error.request) {
        // Request made but no response
        return {
          status: "NETWORK_ERROR",
          message: "Unable to connect to the service. Please check your internet connection.",
        };
      }
    }

    // Timeout error
    if (error.message?.includes('timed out')) {
      return {
        status: "TIMEOUT",
        message: "The request is taking longer than expected. Please try again.",
      };
    }

    // Generic error
    return {
      status: "ERROR",
      message: "An unexpected error occurred. Please try again or contact HR for assistance.",
      error_details: error.message,
    };
  }
}

// ============== HELPER: Request Document via Email ==============
const requestDocumentViaEmail = async (documentType, email, otp, empID) => {
  if (!email || !otp || !empID) {
    console.error("❌ [requestDocumentViaEmail] Missing auth credentials");
    return {
      status: "ERROR",
      message: "Authentication credentials are missing. Please log in again.",
    };
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/alumni/doc-request`,
      {
        document_type: documentType,
      },
      {
        headers: {
          "X-EMAIL": email,
          "X-ALUMNIOTP": otp,
          "X-EMPID": empID,
        },
      }
    );

    if (response.status === 201) {
      return {
        status: "SUCCESS",
        documentType: documentType, // "PS", "PF", "F16"
        email: email, // Make email explicit in response
        message: `Document ${documentType} has been sent to ${email}`,
        _instruction: "Use the appropriate document-specific template from the Document Request Protocol section. ALWAYS include the user's first name in greeting and the actual email address."
      };
    }

    return {
      status: "ERROR",
      message: "There was an issue processing your request. Please try again later.",
    };
  } catch (error) {
    console.error(`❌ [requestDocumentViaEmail] Error:`, error);
    
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return {
        status: "AUTH_FAILED",
        message: "Your session has expired. Please log in again.",
      };
    }

    return {
      status: "ERROR",
      message: "Unable to process your document request. Please try again later.",
    };
  }
};

// ============== ⭐ MAIN FUNCTION: CREATE TOOLS ==============
export const createTools = (
  geography = "Default",
  empID,
  email,
  otp = null,
  ndcCache = null,
  ndcCacheTimestamp = null,
  ticketCache = null,
  ticketCacheTimestamp = null
) => {
  // ============== CORE TOOLS (Available for all geographies) ==============
  const coreTools = {
    // ⭐ TICKET STATUS
    fetchTicketStatus: tool({
      description: `Fetch the status of all tickets raised by the employee. Use this when user asks about ticket status, ticket history, my tickets, or wants to check their raised tickets. 
      CRITICAL: When this tool returns data, your response MUST be exactly:
        "I found [count] tickets for you."
        Do NOT generate tables or lists. The UI renders the table automatically.`,
      parameters: z.object({
        emp_id: z.string().describe("Employee ID"),
      }),
      execute: async ({ emp_id }) => {
        return await safeToolExecution("fetchTicketStatus", async () => {
          // ⭐ VALIDATION
          if (!empID || !email || !otp) {
            console.error("❌ [fetchTicketStatus] Missing auth from closure!");
            return {
              status: "AUTH_FAILED",
              message: "Authentication required. Please log in again.",
              tickets: [],
            };
          }

          const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
          const apiUrl = `${baseUrl}/alumni/tickets/get-tickets`;

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-EMAIL": email,
              "X-ALUMNIOTP": otp,
              "X-EMPID": empID,
            },
            body: JSON.stringify({}),
          });

          if (response.status === 403) {
            console.error("❌ [fetchTicketStatus] 403 Forbidden - Session expired");
            return {
              status: "AUTH_FAILED",
              message: "Session expired. Please log in again.",
              tickets: [],
            };
          }

          if (response.status < 200 || response.status >= 300) {
            console.error(`❌ [fetchTicketStatus] Non-2xx status: ${response.status}`);

            let errorText = "";
            try {
              errorText = await response.text();
              console.error(`❌ [fetchTicketStatus] Error response body: ${errorText}`);
            } catch (e) {
              console.error(`❌ [fetchTicketStatus] Could not read error body`);
            }

            return {
              status: "ERROR",
              message: `Server returned error ${response.status}. Please try again.`,
              tickets: [],
            };
          }

          const data = await response.json();
          const ticketList = data?.objTicketList || [];

          if (ticketList.length === 0) {
            return {
              status: "NO_TICKETS",
              message: "You don't have any tickets yet.",
              tickets: [],
            };
          }

          const formattedTickets = ticketList.map((ticket) => {
            return {
              ticketNo: ticket.ticketDisplayNo,
              category: ticket.classificationName,
              createdOn: ticket.createdOn,
              lastUpdatedOn: ticket.lastUpdatedOn,
              status: ticket.statusName,
            };
          });

          return {
            status: "SUCCESS",
            count: formattedTickets.length,
            tickets: formattedTickets,
            message: `Found ${formattedTickets.length} ticket(s)`,
            _instruction:
              "Respond with ONLY: 'I found X tickets for you.' Nothing else.",
          };
        }, 10000); // 10 second timeout
      },
    }),

    // ⭐ CREATE TICKET
    createTicket: tool({
      description: `This tool should get executed whenever there is a query to create a ticket. After execution, the LLM should generate a friendly response acknowledging the ticket form has been opened.`,
      parameters: z.object({
        query: z.string().describe("The ticket query/description from the user"),
      }),
      execute: async ({ query }) => {
        return await safeToolExecution("createTicket", async () => {
          return JSON.stringify({
            status: "FORM_OPENED",
            action: "show_ticket_creation_modal",
            user_query: query,
            message:
              "Ticket creation form is now available for the user to fill out.",
            next_step: "User should fill in ticket details and submit",
          });
        }, 5000);
      },
    }),

    // ⭐ SEARCH POLICIES
    executeSearch: tool({
      description: `Search HR policy database for ${geography}. Returns ONLY relevant policy excerpts.`,
      parameters: z.object({
        query: z.string().describe("Search query for HR policy"),
      }),
      execute: async ({ query }) => {
        return await safeToolExecution("executeSearch", async () => {
          const response = await fetch(
            "https://hr-cogservice.search.windows.net/indexes/alumni-services-policies/docs/search?api-version=2024-07-01",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "api-key": process.env.EXECUTE_SEARCH_API_KEY || "",
              },
              body: JSON.stringify({
                search: `${query} ${geography}`,
                queryType: "semantic",
                semanticConfiguration:
                  "alumni-services-policies-semantic-configuration",
                answers: "extractive|count-1",
                captions: "extractive|highlight-false",
                select: "",
                top: "3",
                count: "true",
              }),
            }
          );

          if (!response.ok) {
            console.error(`❌ [executeSearch] Search API returned ${response.status}`);
            return {
              status: "ERROR",
              message: "The policy search service is temporarily unavailable. Please try again or contact HR.",
            };
          }

          const responseData = await response.json();
          const searchResults = responseData?.value || [];

          if (searchResults.length === 0) {
            return {
              status: "NO_RESULTS",
              message: "No policy information found for this query.",
              instruction:
                "Respond with: I don't have that information in my policy database. Would you like me to create a ticket for you?",
            };
          }

          const files = searchResults.map((item) => {
            return {
              title: item.title,
              policyUrl: "https://www.microland.one/Policies",
              originalPath: item.metadata_storage_path,
            };
          });

          const resultText = searchResults.map((item) => item.chunk).join("\n");

          return {
            status: "SUCCESS",
            result: resultText,
            files: files,
            instruction: `Answer using ONLY the above context. 
            When referencing policies, direct users to the Policies page using this format:
            "To know more, please visit our [Policies](https://alumniservices.microland.com/policies) page and look for **[Policy Title]**"
            Use the exact policy titles from the 'files' array above (e.g., if title is "Holiday Calendar", use that exact name).`,
          };
        }, 15000); // 15 second timeout for search
      },
    }),

    // ⭐ FETCH NDC STATUS
    fetchNDCStatus: tool({
      description: `Fetch No Dues Clearance (NDC) status for ${geography} employee. 
      Use this when user asks about clearance status, NDC, or specific department clearances.`,
      parameters: z.object({
        emp_id: z.string().describe("Employee ID"),
        department: z
          .string()
          .optional()
          .describe(
            "Specific department (RM, Finance, Admin, CIS, HRSS, Payroll)"
          ),
      }),
      execute: async ({ emp_id, department }) => {
        return await safeToolExecution("fetchNDCStatus", async () => {
          // ⭐ STEP 1: CHECK CACHE FIRST
          if (ndcCache && ndcCacheTimestamp) {
            const cacheAge = Date.now() - ndcCacheTimestamp;
            const CACHE_VALIDITY = 10 * 60 * 1000; // 10 minutes

            if (cacheAge < CACHE_VALIDITY) {
              // If specific department requested
              if (department) {
                const deptData = ndcCache.departments?.find(
                  (d) => d.name.toLowerCase() === department.toLowerCase()
                );

                if (deptData) {
                  return {
                    status: "SUCCESS",
                    source: "cache",
                    department: deptData.name,
                    clearanceStatus: deptData.status,
                  };
                } else {
                  return {
                    status: "ERROR",
                    message: `Department ${department} not found.`,
                  };
                }
              }

              // Return all departments from cache
              return {
                status: "SUCCESS",
                source: "cache",
                departments: ndcCache.departments || [],
                totalDepartments: ndcCache.departments?.length || 0,
              };
            }
          }

          // ⭐ STEP 2: FALLBACK TO API (only if cache miss/stale)
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/alumni/ndc-details`,
            { department: department || null },
            {
              headers: {
                "X-EMAIL": email,
                "X-ALUMNIOTP": otp,
                "X-EMPID": empID,
              },
            }
          );

          const rawData = response.data;

          // Transform to consistent format
          const normalizeStatus = (status) => {
            return status === "Unknown" || status === "unknown"
              ? "Pending"
              : status;
          };

          const departments = [
            {
              name: "RM",
              status: normalizeStatus(rawData.rm_ndc),
              comment: "",
            },
            {
              name: "Finance",
              status: normalizeStatus(rawData.finance_ndc),
              comment: "",
            },
            {
              name: "Admin",
              status: normalizeStatus(rawData.admin_ndc),
              comment: "",
            },
            {
              name: "CIS",
              status: normalizeStatus(rawData.cis_ndc),
              comment: rawData.cis_comment || "",
            },
            {
              name: "HRSS",
              status: normalizeStatus(rawData.hrss_ndc),
              comment: "",
            },
            {
              name: "Payroll",
              status: normalizeStatus(rawData.payroll_ndc),
              comment: rawData.payroll_ndc_comment || "",
            },
          ];

          // If specific department requested
          if (department) {
            const deptData = departments.find(
              (d) => d.name.toLowerCase() === department.toLowerCase()
            );

            if (deptData) {
              return {
                status: "SUCCESS",
                source: "api",
                department: deptData.name,
                clearanceStatus: deptData.status,
              };
            }
          }

          // Return all departments
          return {
            status: "SUCCESS",
            source: "api",
            departments: departments,
            totalDepartments: departments.length,
          };
        }, 10000); // 10 second timeout
      },
    }),

    // ⭐ CURRENT DATE/TIME
    currentDateTimeTool: tool({
      description: `Get the current date and time for ${geography}.`,
      parameters: z.object({}),
      execute: async () => {
        return await safeToolExecution("currentDateTimeTool", async () => {
          const now = new Date();
          let localDate = new Date(now);

          switch (geography) {
            case "India":
              localDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
              break;
            case "UK":
              localDate = new Date(now.getTime() + 0 * 60 * 60 * 1000);
              break;
            case "USA":
              localDate = new Date(now.getTime() - 5 * 60 * 60 * 1000);
              break;
            case "Saudi":
              localDate = new Date(now.getTime() + 3 * 60 * 60 * 1000);
              break;
          }

          return {
            date: localDate.toLocaleDateString(),
            time: localDate.toLocaleTimeString(),
            timestamp: localDate.getTime(),
            geography: geography,
          };
        }, 2000);
      },
    }),

    // ⭐ REQUEST PAYSLIP (Available for all geographies)
    requestPayslip: tool({
      description: `Request payslip to be emailed to an employee.
      Use this when user asks for payslip, salary slip, or pay details.`,
      parameters: z.object({}),
      execute: async () => {
        return await safeToolExecution("requestPayslip", async () => {
          if (!empID || !email || !otp) {
            return {
              status: "AUTH_FAILED",
              message: "Authentication required. Please log in again.",
            };
          }

          return await requestDocumentViaEmail("PS", email, otp, empID);
        }, 10000);
      },
    }),
  };

  // ============== ADD INDIA-SPECIFIC TOOLS ==============
  if (geography === "India") {
    coreTools.requestPFStatement = tool({
      description: `Request PF statement to be emailed to an Indian employee. 
      Use this when user asks for PF details, PF statement, or provident fund information.`,
      parameters: z.object({}),
      execute: async () => {
        return await safeToolExecution("requestPFStatement", async () => {
          if (!empID || !email || !otp) {
            return {
              status: "AUTH_FAILED",
              message: "Authentication required. Please log in again.",
            };
          }

          return await requestDocumentViaEmail("PF", email, otp, empID);
        }, 10000);
      },
    });

    coreTools.requestFormSixteen = tool({
      description: `Request Form 16 to be emailed to an Indian employee.
      Use this when user asks for Form 16, tax documents, or TDS certificate.`,
      parameters: z.object({}),
      execute: async () => {
        return await safeToolExecution("requestFormSixteen", async () => {
          if (!empID || !email || !otp) {
            return {
              status: "AUTH_FAILED",
              message: "Authentication required. Please log in again.",
            };
          }

          return await requestDocumentViaEmail("F16", email, otp, empID);
        }, 10000);
      },
    });
  }

  return coreTools;
};