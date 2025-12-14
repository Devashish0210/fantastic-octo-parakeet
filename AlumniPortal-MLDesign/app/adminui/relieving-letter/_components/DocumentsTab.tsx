"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import LinkTabs from "@/app/_components/link-tabs";
import { linkTabsData } from "./link-tabs-data";
import { getCookie } from "@/app/utils/cookieManager";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function RelievingLetterReleaseTab() {
  const [employeeId, setEmployeeId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [exemptList, setExemptList] = useState([]);
  const router = useRouter();

  // Function to check if user is still authenticated
  const checkAuthentication = async () => {
    try {
      const email = getCookie("userEmail");
      const otp = getCookie("userOtp");

      if (!email || !otp) {
        return false;
      }

      const response = await fetch(
        "https://alumniapi.microland.com/adminui/is-allowed",
        {
          method: "POST",
          headers: {
            "X-EMAIL": email,
            "X-OTP": otp,
          },
        }
      );

      if (response.status !== 200) {
        return false;
      }

      const data = await response.json();
      return data && data.is_active === true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  };

  // Function to handle logout when authentication fails
  const handleAuthFailure = () => {
    setMessage({
      text: "Your session has expired. Redirecting to login page...",
      type: "error",
    });

    setTimeout(() => {
      router.push("/adminui/login");
    }, 2000);
  };

  // Function to fetch the list of exempt employees
  const fetchExemptList = async () => {
    try {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        handleAuthFailure();
        return;
      }

      const email = getCookie("userEmail");
      const otp = getCookie("userOtp");

      const response = await fetch(
        "https://alumniapi.microland.com/adminui/exempt-rl",
        {
          method: "GET",
          //@ts-ignore
          headers: {
            "Content-Type": "application/json",
            "X-EMAIL": email,
            "X-OTP": otp,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExemptList(data);
      } else {
        // Check if authentication is still valid
        const isAuthStillValid = await checkAuthentication();
        if (!isAuthStillValid) {
          handleAuthFailure();
          return;
        }

        console.error("Failed to fetch exempt list");
        setMessage({
          text: "Failed to fetch the list of relieving letter exemptions.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching exempt list:", error);
      setMessage({
        text: "An error occurred while fetching data. Please try again.",
        type: "error",
      });
    }
  };

  // Function to handle submission of new exempt employee
  const handleSubmit = async () => {
    if (!employeeId.trim()) {
      setMessage({ text: "Please enter an Employee ID.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        handleAuthFailure();
        return;
      }

      const email = getCookie("userEmail");
      const otp = getCookie("userOtp");
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

      const response = await fetch(
        "https://alumniapi.microland.com/adminui/exempt-rl/",
        {
          method: "POST",
          //@ts-ignore
          headers: {
            "Content-Type": "application/json",
            "X-EMAIL": email,
            "X-OTP": otp,
          },
          body: JSON.stringify({
            employee_id: employeeId,
            added_on: today,
            remarks: remarks,
          }),
        }
      );

      const isAuthStillValid = await checkAuthentication();
      if (!isAuthStillValid) {
        handleAuthFailure();
        return;
      }

      if (response.ok) {
        setMessage({
          text: "Employee successfully exempted from relieving letter requirement.",
          type: "success",
        });
        // Reset form fields
        setEmployeeId("");
        setRemarks("");
        // Refresh the list
        fetchExemptList();
      } else {
        let errorMessage = "Failed to submit. Please try again.";
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText;
        }

        setMessage({
          text: errorMessage,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting:", error);
      setMessage({
        text: "An error occurred during submission. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to delete an exempt record
  //@ts-ignore
  const handleDelete = async (employeeId) => {
    try {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        handleAuthFailure();
        return;
      }

      const email = getCookie("userEmail");
      const otp = getCookie("userOtp");

      // Since the actual delete API wasn't provided, assuming it follows RESTful conventions
      const response = await fetch(
        `https://alumniapi.microland.com/adminui/exempt-rl/?employee_id=${employeeId}`,
        {
          method: "DELETE",
          //@ts-ignore
          headers: {
            "Content-Type": "application/json",
            "X-EMAIL": email,
            "X-OTP": otp,
          },
        }
      );

      const isAuthStillValid = await checkAuthentication();
      if (!isAuthStillValid) {
        handleAuthFailure();
        return;
      }

      if (response.ok) {
        setMessage({
          text: "Record deleted successfully.",
          type: "success",
        });
        // Refresh the list
        fetchExemptList();
      } else {
        setMessage({
          text: "Failed to delete the record. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      setMessage({
        text: "An error occurred while deleting the record. Please try again.",
        type: "error",
      });
    }
  };

  // Fetch exempt list on component mount
  useEffect(() => {
    fetchExemptList();
    // Set up an interval to check authentication periodically
    const authCheckInterval = setInterval(async () => {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        handleAuthFailure();
        clearInterval(authCheckInterval);
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(authCheckInterval);
    };
  }, []);

  return (
    <div className="w-full">
      <LinkTabs
        data={linkTabsData.data}
        style={linkTabsData.style}
        selected={2}
      />
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium mb-4">Relieving Letter Release</h2>

          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            <div className="flex-1">
              <label className="block mb-2">Employee ID:</label>
              <Input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID"
                size="lg"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2">Remarks:</label>
              <Input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks"
                size="lg"
              />
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                color="danger"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                size="lg"
              >
                Submit
              </Button>
            </div>
          </div>

          {message.text && (
            <div
              className={`mt-4 p-3 rounded ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">
              Relieving Letter Release
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Employee ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Remarks
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Released On
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Delete Record
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exemptList.length > 0 ? (
                    exemptList.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                          {/* @ts-ignore */}
                          {item.employee_id}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {/* @ts-ignore */}
                          {item.remarks}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {/* @ts-ignore */}
                          {item.added_on}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            //@ts-ignore
                            onClick={() => handleDelete(item.employee_id)}
                            aria-label="Delete"
                          >
                            <Trash2 size={20} className="text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        //@ts-ignore
                        colSpan="4"
                        className="border border-gray-300 px-4 py-2 text-center"
                      >
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-medium mb-2">Notes:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Employees added to this list will be exempted from the relieving
                letter requirement
              </li>
              <li>
                Your session expires after 5 minutes. You will be redirected to
                the login page if your session expires.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
