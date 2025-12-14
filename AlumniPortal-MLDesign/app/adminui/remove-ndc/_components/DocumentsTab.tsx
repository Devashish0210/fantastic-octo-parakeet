"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import LinkTabs from "@/app/_components/link-tabs";
import { linkTabsData } from "./link-tabs-data";
import { getCookie } from "@/app/utils/cookieManager";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NDCRemoverTab() {
  const [employeeId, setEmployeeId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch reminders on component mount
  useEffect(() => {
    fetchReminders();
  }, []);

  // Check authentication status
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

  // Handle authentication failure
  const handleAuthFailure = () => {
    setMessage({
      text: "Your session has expired. Redirecting to login page...",
      type: "error",
    });

    setTimeout(() => {
      router.push("/adminui/login");
    }, 2000);
  };

  // Fetch NDC reminders list
  const fetchReminders = async () => {
    setIsLoading(true);
    try {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        handleAuthFailure();
        return;
      }

      const email = getCookie("userEmail");
      const otp = getCookie("userOtp");

      const response = await fetch(
        "https://alumniapi.microland.com/adminui/ndc-reminders/",
        {
          method: "GET",
          //@ts-ignore
          headers: {
            "X-EMAIL": email,
            "X-OTP": otp,
            "Content-Type": "application/json",
          },
        }
      );

      const isAuthStillValid = await checkAuthentication();
      if (!isAuthStillValid) {
        handleAuthFailure();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch reminders");
      }

      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      setMessage({
        text: "Failed to load NDC reminders. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new NDC reminder
  //@ts-ignore
  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      setMessage({
        text: "Please enter an Employee ID.",
        type: "error",
      });
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

      // Get current date in YYYY-MM-DD format
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      const response = await fetch(
        "https://alumniapi.microland.com/adminui/ndc-reminders/",
        {
          method: "POST",
          //@ts-ignore
          headers: {
            "X-EMAIL": email,
            "X-OTP": otp,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: employeeId,
            remarks: remarks || "NDC reminder added",
            added_on: formattedDate,
            is_active: true,
          }),
        }
      );

      const isAuthStillValid = await checkAuthentication();
      if (!isAuthStillValid) {
        handleAuthFailure();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || `Failed to add reminder: ${response.statusText}`
        );
      }

      setMessage({
        text: "NDC reminder added successfully!",
        type: "success",
      });

      // Clear form and refresh list
      setEmployeeId("");
      setRemarks("");
      fetchReminders();
    } catch (error) {
      console.error("Error adding reminder:", error);
      setMessage({
        //@ts-ignore
        text: error.message || "Failed to add NDC reminder. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete NDC reminder
  //@ts-ignore
  const handleDeleteReminder = async (id) => {
    try {
      setMessage({ text: "", type: "" });

      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        handleAuthFailure();
        return;
      }

      const email = getCookie("userEmail");
      const otp = getCookie("userOtp");

      const response = await fetch(
        `https://alumniapi.microland.com/adminui/ndc-reminders/?employee_id=${id}`,
        {
          method: "DELETE",
          //@ts-ignore
          headers: {
            "X-EMAIL": email,
            "X-OTP": otp,
            "Content-Type": "application/json",
          },
        }
      );

      const isAuthStillValid = await checkAuthentication();
      if (!isAuthStillValid) {
        handleAuthFailure();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to delete reminder: ${response.statusText}`);
      }

      setMessage({
        text: "NDC reminder deleted successfully!",
        type: "success",
      });

      // Refresh the list
      fetchReminders();
    } catch (error) {
      console.error("Error deleting reminder:", error);
      setMessage({
        text: "Failed to delete NDC reminder. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full">
      <LinkTabs
        data={linkTabsData.data}
        style={linkTabsData.style}
        selected={1}
      />
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium mb-4">Remove NDC Trigger</h2>

          <p className="mb-6">
            Add or remove NDC reminders for employees. NDC reminders will
            trigger notifications to employees.
          </p>

          <form className="mb-8" onSubmit={handleAddReminder}>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <Input
                label="Employee ID"
                placeholder="Enter Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="flex-1"
                size="lg"
                required
              />
              <Input
                label="Remarks"
                placeholder="Enter remarks (optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="flex-1"
                size="lg"
              />
            </div>

            <Button
              type="submit"
              color="danger"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="px-6"
              size="lg"
            >
              Add Employee to NDC Reminder Cancellation List
            </Button>
          </form>

          {message.text && (
            <div
              className={`mb-6 p-3 rounded ${
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
              NDC Reminder Cancellation List
            </h3>

            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : reminders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No NDC reminders found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Employee ID</th>
                      <th className="border p-3 text-left">Remarks</th>
                      <th className="border p-3 text-left">Added On</th>
                      <th className="border p-3 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reminders.map((reminder) => (
                      //@ts-ignore
                      <tr key={reminder.id} className="border-b">
                        {/* @ts-ignore */}
                        <td className="border p-3">{reminder.employee_id}</td>
                        {/* @ts-ignore */}
                        <td className="border p-3">{reminder.remarks}</td>
                        {/* @ts-ignore */}
                        <td className="border p-3">{reminder.added_on}</td>
                        <td className="border p-3 text-center">
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            onClick={() =>
                              //@ts-ignore
                              handleDeleteReminder(reminder.employee_id)
                            }
                            aria-label="Delete"
                          >
                            <Trash2 size={20} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* <div className="mt-8">
            <h3 className="font-medium mb-2">Notes:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Adding a new NDC reminder will trigger the notification process
              </li>
              <li>
                Deleting a reminder will remove it permanently from the system
              </li>
              <li>
                Your session expires after 5 minutes. You will be redirected to
                the login page if your session expires.
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
}
