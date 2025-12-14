"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";

interface Ticket {
  ticketNo: string;
  category: string;
  createdOn: string;
  lastUpdatedOn: string;
  status: string;
}

interface TicketStatusTableProps {
  tickets: Ticket[];
}

export default function TicketStatusTable({ tickets }: TicketStatusTableProps) {
  const convertDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("resolved") || statusLower.includes("closed")) {
      return "success";
    }
    if (statusLower.includes("pending") || statusLower.includes("open")) {
      return "warning";
    }
    if (statusLower.includes("progress") || statusLower.includes("processing")) {
      return "primary";
    }
    return "default";
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg bg-gray-50">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-600 font-medium mb-1">No Tickets Found</p>
        <p className="text-gray-500 text-sm">
          You haven't raised any tickets yet.
        </p>
      </div>
    );
  }

  return (
    <div className="my-4 w-full">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">
          Your Tickets ({tickets.length})
        </h3>
      </div>

      <Table 
        isStriped 
        aria-label="Ticket status table"
        classNames={{
          wrapper: "shadow-md rounded-lg",
        }}
      >
        <TableHeader>
          <TableColumn>Ticket No</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Created On</TableColumn>
          <TableColumn>Last Updated</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket, index) => (
            <TableRow key={index}>
              <TableCell>
                <span className="font-semibold text-primary">
                  {ticket.ticketNo}
                </span>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate" title={ticket.category}>
                  {ticket.category}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{convertDate(ticket.createdOn)}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {convertDate(ticket.lastUpdatedOn)}
                </span>
              </TableCell>
              <TableCell>
                <Chip
                  color={getStatusColor(ticket.status)}
                  variant="flat"
                  size="sm"
                >
                  {ticket.status}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Need help? Ask me about any specific ticket or raise a new one.
        </p>
      </div>
    </div>
  );
}