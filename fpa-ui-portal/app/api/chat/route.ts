import { generateObject, createDataStreamResponse, streamText, tool } from "ai";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

import { azure } from "@/lib/aoi";
import {
  conversationResponsePrompt,
  greetingResponsePrompt,
  databaseQueryToolPrompt,
  insightsPrompt,
} from "@/lib/prompts";
import { executeSQLQuery, fetchSQLQuery } from "@/lib/tools";
import { insightsModel } from "@/lib/fw";
import { streamSQLGenerations } from "@/lib/api";

export const maxDuration = 30;

// API Function to handle POST requests for AI insights processing
export async function POST(req: NextRequest) {
  /* ------------------------------------------------------------------->
  This function processes user input, generates SQL queries, 
  executes them, and provides insights based on the results.

  It uses AI to classify the type of question and respond accordingly, 
  handling different types of user interactions such as greetings, 
  conversations, and database queries.

  It also includes error handling for invalid requests and ensures that 
  the request is authenticated before processing. 
  -------------------------------------------------------------------> */

  try {
    // Ensure the request is authenticated
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const accessToken =
      typeof token?.accessToken === "string" ? token.accessToken : undefined;

    // Check if the access token is present
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { messages, db_connection_id } = await req.json();

    // Stream the response
    return createDataStreamResponse({
      async execute(dataStream) {
        // generateObject to classify the user input
        const { object: classification } = await generateObject({
          model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME!),
          schema: z.object({
            route: z.enum(["Greeting", "Conversation", "DatabaseQuery"]),
            confidence: z.number().min(0).max(1).optional(),
            question : z.string().describe("The User input or question to be classified"),
          }),
          messages,
          system: `You are an advanced question classifier designed to accurately categorize user inputs:
              
                  1. 'Greeting' - Strictly for messages that are purely greetings or social pleasantries, such as:
                     - "Hi there"
                     - "Hello"
                     - "Good morning"
                     - "How are you?"
                     - Quick, informal opening exchanges with no substantive content
              
                  2. 'Conversation' - For general chatting, open-ended discussions, or conversational queries that:
                     - Involve general discussion
                     - Seek advice or opinions
                     - Request explanations or clarifications
                     - Engage in small talk or casual conversation
                     - Do not specifically request database-driven information or reports
              
                  3. 'DatabaseQuery' - Specifically for queries requesting specific data retrieval or reporting, such as:
                     - "Show me invoices generated last month"
                     - "List suppliers with MSME classification"
                     - "Generate a report of sales for Q1 2024"
                     - "Retrieve customer details for XYZ company"
                     - Queries that require direct data extraction from a database or structured information system
              
                  Your task is to precisely categorize each input into one of these three routes based on its primary intent and content.`,
        });

        console.log(classification, "classification");

        // Initial state - thinking about the response
        dataStream.writeData({
          type: "ProcessingState",
          state: "thinking",
        });

        // Handle different classification routes
        // check if the classification is a "Greeting"
        if (classification.route === "Greeting") {
          const result = streamText({
            model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME!),
            system: greetingResponsePrompt,
            messages,
          });
          // Merge the result into the data stream
          result.mergeIntoDataStream(dataStream);
        }

        // check if the classification is a general "Conversation"
        if (classification.route === "Conversation") {
          const result = streamText({
            model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME!),
            system: conversationResponsePrompt,
            messages,
          });
          // Merge the result into the data stream
          result.mergeIntoDataStream(dataStream);
        }

        // check if the classification is a "DatabaseQuery"
        if (classification.route === "DatabaseQuery") {
          // streamText to handle database queries
          const stream = streamText({
            model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME!),
            system: databaseQueryToolPrompt,
            messages: messages,
            // Tool to generate and execute SQL queries
            tools: {
              sqlQueryTool: tool({
                description: "Generates and executes SQL queries using AI",
                parameters: z.object({
                  question: z
                    .string()
                    .describe("The User question for which SQL query to be generated and executed"),
                }),
                execute: async ({ question }, { toolCallId }) => {

                  // Signal that we're generating SQL Query
                  dataStream.writeData({
                    type: "ProcessingState",
                    state: "fetchingSQL",
                  });

                  try {
                    // Step 1: Generate SQL Query
                    const generatedQuery = await fetchSQLQuery(classification?.question || "", db_connection_id);
                      console.log(generatedQuery,'dkajksdjajd')
                    // Check if the response is valid and generated a SQL Query
                    if (!generatedQuery || !generatedQuery?.id) {
                      dataStream.writeData({
                        type: "Error",
                        text: "Failed to generate SQL query.",
                      });
                      return "Failed to generate SQL query.";
                    }

                    // Signal that we're executing SQL Query
                    dataStream.writeData({
                      type: "ProcessingState",
                      state: "executingSQL",
                    });

                    // Step 2: Execute the SQL Query
                    const executionResult = await executeSQLQuery(generatedQuery?.id);

                    // Check if the execution result is valid
                    if (!executionResult) {
                      dataStream.writeData({
                        type: "Error",
                        text: "Failed to execute SQL Query.",
                      });
                      return "Failed to execute SQL Query.";
                    }

                    // Step 3: Classify and Generate Insights based on the execution result
                    // Classify Query Insights
                    const { object: insightClassification } = await generateObject({
                      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME!),
                      schema: z.object({
                        category: z.enum([
                          "trend_analysis",
                          "anomaly_detection",
                          "summary",
                          "unknown",
                        ]),
                        reasoning: z.string(),
                      }),
                      prompt: `Classify this database query insight:
                            - User Query: ${classification?.question}
                            - Query Results: ${JSON.stringify(executionResult)}
                            - SQL Executed: ${JSON.stringify(
                              generatedQuery?.sql
                            )}`,
                      system:
                        "You are an expert data analyst. Classify and reason about SQL results.",
                    });

                    // Signal that we're generating insights
                    dataStream.writeData({
                      type: "ProcessingState",
                      state: "generatingInsights",
                    });

                    // Generate Insights and merge into data stream
                    const insightsStream = streamText({
                      model: insightsModel,
                      system:
                        insightClassification?.category &&
                        insightClassification.category in insightsPrompt
                          ? insightsPrompt[
                              insightClassification.category as keyof typeof insightsPrompt
                            ]
                          : "",
                      prompt: `Analyze SQL execution result:
                            - User Query: ${classification?.question}
                            - Classification: ${insightClassification?.reasoning}
                            - SQL Query: ${JSON.stringify(generatedQuery?.sql)}
                            - Query Results: ${JSON.stringify(
                              executionResult,
                              null,
                              2
                            )}
                            Provide detailed insights in Markdown format.`,
                      onChunk({ chunk }) {
                        if (chunk.type === "reasoning") {
                          dataStream?.writeData({
                            type: "Reasoning",
                            result: chunk.textDelta,
                            toolCallId,
                          });
                        }
                      },
                    }).mergeIntoDataStream(dataStream);

                    // Signal completion
                    dataStream.writeData({
                      type: "ProcessingState",
                      state: "completed",
                    });

                    // Step 4: Stream SQL Generations
                    // Use streamSQLGenerations with token for streaming SQL generations
                    const streamResponse = await streamSQLGenerations(
                      accessToken,
                      classification?.question,
                      db_connection_id
                    );

                    // Check if the stream response is valid
                    if (!streamResponse) {
                      dataStream.writeData({
                        type: "Error",
                        text: "Failed to generate and execute SQL query via streaming.",
                      });
                      return "Failed to generate and execute SQL query via streaming.";
                    }

                    // Return the SQL and query results
                    return {
                      sql: generatedQuery?.sql || "",
                      queryResults: executionResult ? executionResult : [],
                    };
                  } catch (error) {
                    console.error("Error with streamSQLGenerations:", error);
                    dataStream.writeData({
                      type: "Error",
                      text: `Failed to process SQL query via streaming: ${error}`,
                    });
                    return "Failed to process SQL query via streaming.";
                  }
                },
              }),
            },
          });

          // Merge the stream into the data stream
          stream.mergeIntoDataStream(dataStream);
        }
      },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
