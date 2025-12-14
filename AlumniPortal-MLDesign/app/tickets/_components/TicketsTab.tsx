"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Tab, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import RequestForm from "./RequestForm";
import TableCustom from "./Table";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import getTickets from "../_api-helpers/get-ticket";
import {
  setState,
  initialState as emptTicketStatusState,
} from "@/redux-toolkit/features/ticket-status";
import LoadingButton from "@/app/_components/LoadingButton";
import { motion } from "framer-motion";
// import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

export default function DocumentsTab() {
  const ticketStatus = useAppSelector((state) => state.ticketStatus);
  const reloadLoading = useAppSelector((state) => state.ticketStatus.isLoading);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const [activeTab, setActiveTab] = useState("create-ticket");
  const getDetails = async () => {
    const res = await getTickets(employeeLoginState, dispatch, router);
    const data = {
      isLoading: false,
      data: res,
    };
    dispatch(setState(data));
  };

  useEffect(() => {
    if (reloadLoading) {
      getDetails();
    }
  }, [reloadLoading]);

  const handleReloadClick = () => {
    dispatch(setState(emptTicketStatusState));
  };

  return (
    /* 🔴 CHANGED: Added responsive padding container */
    <div className="w-full px-4 md:px-8">
      <Breadcrumbs className="mb-4">
        <BreadcrumbItem href="/actions">Home</BreadcrumbItem>
        <BreadcrumbItem href="/tickets">Tickets</BreadcrumbItem>
      </Breadcrumbs>
      
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        aria-label="Tabs variants"
        variant="underlined"
        color="danger"
        classNames={{
          /* 🔴 CHANGED: Added responsive gap and consistent border styling */
          tabList: "gap-4 md:gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#E53526]",
          /* 🔴 CHANGED: Added responsive height and padding */
          tab: "max-w-fit px-3 md:px-4 h-10 md:h-12",
          tabContent: "group-data-[selected=true]:text-[#E53526]",
        }}
      >
        <Tab key="create-ticket" title="Create Ticket">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            /* 🔴 CHANGED: Added responsive padding */
            className="py-4 md:py-6"
          >
            <RequestForm onSuccess={getDetails} />
          </motion.div>
        </Tab>

        <Tab key="status-of-tickets" title="Status of Tickets">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            /* 🔴 CHANGED: Added responsive padding */
            className="py-4 md:py-6"
          >
            <TableCustom items={ticketStatus} />
          </motion.div>
        </Tab>
      </Tabs>
    </div>
  );
}