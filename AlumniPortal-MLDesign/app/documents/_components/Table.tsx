// App/documents/_components/Table.tsx
"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import {
  Ndc,
  buildOwnerRow,
  deriveRelievingLetter,
  deriveServiceLetter,
  deriveFullFinalWithLwd,
  displayStatus,
} from "./ndcLogic";

type Props = { ndc?: Partial<Ndc> };

const columns = [
  { key: "owner", label: "NDC Owner" },
  { key: "status", label: "Status" },
  { key: "comment", label: "Comment" },
];

export default function NdcTable({ ndc }: Props) {
  const d: Partial<Ndc> = ndc ?? {};

  // Owner rows (status/comment always populated)
  const rm      = buildOwnerRow("rm",      d.rmNdcStatus,      d.rmNdcComment);
  const finance = buildOwnerRow("finance", d.financeNdcStatus, d.financeNdcComment);
  const admin   = buildOwnerRow("admin",   d.adminNdcStatus,   d.adminNdcComment);
  const cis     = buildOwnerRow("cis",     d.cisNdcStatus,     d.cisNdcComment);
  const hrss    = buildOwnerRow("hrss",    d.hrssNdcStatus,    d.hrssNdcComment);

  // Payroll row (status/comment always populated through deriveFullFinalWithLwd + default mapping)
  const ff = deriveFullFinalWithLwd(d);
  const payrollStatus = displayStatus(d.payrollNdcStatus);

  // Document rows (always populated)
  const rl = deriveRelievingLetter(d);
  const sl = deriveServiceLetter(d);

  const rows = [
    { id: "rm",      owner: "Reporting Manager", status: rm.status,      comment: rm.comment },
    { id: "finance", owner: "Finance",           status: finance.status, comment: finance.comment },
    { id: "admin",   owner: "Admin",             status: admin.status,   comment: admin.comment },
    { id: "cis",     owner: "CIS",               status: cis.status,     comment: cis.comment },
    { id: "hrss",    owner: "HRSS",              status: hrss.status,    comment: hrss.comment },

    { id: "payroll", owner: "Final Settlement", status: payrollStatus, comment: ff.statusText },

    { id: "rl",      owner: "Relieving Letter",  status: rl.statusText,  comment: rl.commentText },
    { id: "sl",      owner: "Service Letter",    status: sl.statusText,  comment: sl.commentText },
  ];

  return (
    <div>
      <Table
      aria-label="My NDC Status"
      removeWrapper
      classNames={{
        base: "rounded-2xl shadow-sm border border-gray-200 overflow-hidden",
        table: "min-w-full",
        thead: "bg-transparent",
        th: "text-sm font-semibold text-slate-700 py-3 px-4 bg-transparent",
        tr: "odd:bg-slate-50 even:bg-white",
        td: "text-[15px] py-4 px-4 align-middle",
        wrapper: "bg-white",
      }}
    >
      <TableHeader columns={columns}>
        {(col) => <TableColumn key={col.key}>{col.label}</TableColumn>}
      </TableHeader>

      <TableBody items={rows}>
        {(row) => (
          <TableRow key={row.id}>
            <TableCell>{row.owner}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell className="max-w-[900px] whitespace-pre-wrap break-words">
              {row.comment}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded-r-md">
        <p className="text-sm text-green-800">
          <strong>Note:</strong> In case of pending NDC clearance, please
          coordinate with respective department POC for clearance or raise AskML
          ticket
        </p>
      </div>
    </div>
  );
}
