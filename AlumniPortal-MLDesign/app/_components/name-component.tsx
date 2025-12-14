"use client";
import { useAppSelector } from "@/redux-toolkit/hooks";
import React from "react";

export default function NameComponent() {
  const name = useAppSelector((state) => state.employeeDetails.name);
  return <p className="font-bold text-large">Hi {name},</p>;
}
