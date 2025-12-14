"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Spinner,
} from "@nextui-org/react";
import { InitialState as Items } from "@/redux-toolkit/features/ticket-status";

export default function TableCustom({ items }: { items: Items }) {
  const convertDate = (dateString: string) => {
  if (!dateString) return "N/A";
  
  // Parse the date string
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return "Invalid Date";
  
  // Format day/month/year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  
  // Format hours and minutes with padding
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  // Return formatted string: DD/MM/YYYY, HH:MM
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
};

  return items.isLoading ? (
    <div className="flex justify-center items-center w-auto flex-col gap-2 py-32">
      <h1 className="text-primary text-xl">Alumni Services</h1>
      <Spinner />
    </div>
  ) : items.data.length > 0 ? (
    <Table isStriped aria-label="TICKET STATUS TABLE">
      <TableHeader>
        <TableColumn>Ticket No</TableColumn>
        <TableColumn>Category</TableColumn>
        <TableColumn>Created On</TableColumn>
        <TableColumn>Last Updated On</TableColumn>
        <TableColumn>Current Status</TableColumn>
      </TableHeader>
      <TableBody>
        {items["data"].map((val, index) => {
          return (
            <TableRow key={index}>
              <TableCell>
                <p>{val.ticketDisplayNo}</p>
              </TableCell>
              <TableCell>
                <p>{val.classificationName}</p>
              </TableCell>
              <TableCell>
                <p>{convertDate(val.createdOn)}</p>
              </TableCell>
              <TableCell>
                <p>{convertDate(val.lastUpdatedOn)}</p>
              </TableCell>
              <TableCell>
                <p>{val.statusName}</p>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  ) : (
    <div>
      <p>No Tickets History</p>
      <p>Please Create a Ticket if you have any Query</p>
    </div>
  );
}
