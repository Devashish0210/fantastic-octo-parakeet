"use client";

import React, { useEffect } from "react";
import { Tabs, Tab, Spinner, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import TableCustom from "./Table";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import getNDC from "../_api-helpers/ndc";
import {
  setState,
  initialState as emptyNDCSTate,
  InitialState as NDCType,
} from "@/redux-toolkit/features/ndc";
import { motion } from "framer-motion";
// import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import LinkTabs from "@/app/_components/link-tabs";
import { linkTabsData } from "@/app/_components/link-tabs-data";
import NameComponent from "@/app/_components/name-component";
import type { Ndc } from "./ndcLogic";



function toNdc(
  rows: { name: string; status: string; comment: string }[],
  extras?: Partial<Ndc>
) {
  const norm = (s?: string) => (s ?? "").trim().toLowerCase();
  const by = (label: string) =>
    rows.find((r) => norm(r.name) === norm(label)) ?? { status: "Pending", comment: "" };

  const rm  = by("Reporting Manager");
  const fin = by("Finance");
  const adm = by("Admin");
  const cis = by("CIS");
  const hrss= by("HRSS");
  const pay = by("Final Settlement");

  return {
    rmNdcStatus: rm.status,       rmNdcComment: rm.comment,
    financeNdcStatus: fin.status, financeNdcComment: fin.comment,
    adminNdcStatus: adm.status,   adminNdcComment: adm.comment,
    cisNdcStatus: cis.status,     cisNdcComment: cis.comment,
    hrssNdcStatus: hrss.status,   hrssNdcComment: hrss.comment,
    payrollNdcStatus: pay.status, payrollNdcComment: pay.comment,
    ...(extras ?? {}), // NEW merge
  } as const;
}


export default function DocumentsTab({
  children,
}: {
  children: React.ReactNode;
}) {
  const ndc = useAppSelector((state) => state.ndc);
  const reloadLoading = useAppSelector((state) => state.ndc.isLoading);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  type NDCRow = { name: string; status: string; comment: string };
  const getDetails = async () => {
    const res = await getNDC(employeeLoginState, dispatch, router);
    // console.log(res);
    
    const rows: NDCRow[] = [
    { name: "Reporting Manager", status: String(res["rm_ndc"] ?? ""),      comment: "" },
    { name: "Finance",           status: String(res["finance_ndc"] ?? ""), comment: "" },
    { name: "Admin",             status: String(res["admin_ndc"] ?? ""),   comment: "" },
    { name: "CIS",               status: String(res["cis_ndc"] ?? ""),     comment: String(res["cis_comment"] ?? "") },
    { name: "HRSS",              status: String(res["hrss_ndc"] ?? ""),    comment: "" },
    { name: "Final Settlement",  status: String(res["payroll_ndc"] ?? ""), comment: String(res["payroll_ndc_comment"] ?? "") },
  ];
    const extras = {
    ffStatus: res["ff_status"],                                // if backend provides
    ffNegativeButSettled:
      Boolean(res["ff_negative_but_settled"]) ||
      (typeof res["ff_status"] === "string" &&
       res["ff_status"].toLowerCase() === "negative but settled"),
    lwdDate: res["lwd"] || res["last_working_day"] || res["lwd_date"], // first non-empty
  };

  dispatch(setState({ isLoading: false, data: rows, extras })); // NEW: extras
};

  const isNdcStausFinished = (data: NDCType) => {
    // console.log(
    //   "ndc",
    //   ndc.data,
    //   data.data.filter((val) => val.status !== "Completed")
    // );
    return data.data.filter((val) => val.status !== "Completed").length === 0;
  };
useEffect(() => {
  const needsFirstFetch = (ndc.data?.length ?? 0) === 0;
  if (ndc.isLoading || needsFirstFetch) {
    getDetails();
  }
}, [ndc.isLoading, ndc.data?.length]);

const handleReloadClick = () => {
  dispatch(setState({ ...emptyNDCSTate, isLoading: true }));
};

// console.log("[ndc] slice state", ndc);               // shape: { data: rows[], isLoading } 
// console.log("[ndc] adapter input rows", ndc.data);   // rows for toNdc
// console.log("[ndc] partial ndc", toNdc(ndc.data));   // keys that Table expects


  return (
    <div className="w-full">
      {ndc.isLoading ? (
        <div className="w-full h-[68vh] flex flex-col justify-center items-center">
          <h1 className="text-primary text-2xl mb-1">Loading</h1>
          <Spinner color="primary" size="md" />
        </div>
      ) : (
        <>
          <Breadcrumbs className="mb-4" aria-label="Breadcrumb">
          <BreadcrumbItem href="/actions" className="text-primary">Home</BreadcrumbItem>
          <BreadcrumbItem href="/documents" className="text-primary">Documents</BreadcrumbItem>
          </Breadcrumbs>
          <Tabs
            aria-label="Options"
            color="danger"
            variant="underlined"
            defaultSelectedKey={"ndc"}
            classNames={{
              tabList:
                "gap-12 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-[#22d3ee]",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-[#06b6d4]",
            }}
          >
            {!ndc.isLoading && !isNdcStausFinished(ndc) && (
              <Tab key="ndc" title={<div className="flex justify-center items-center"><p>My NDC Status</p></div>}>
  <TableCustom ndc={toNdc(ndc.data, ndc.extras)} />   
</Tab>
            )}

              <Tab
              key="documents"
              title={
                <div className="flex items-center space-x-2">
                  <span>My Documents</span>
                </div>
              }
            >
              {children}
            </Tab>
          </Tabs>
        </>
      )}
    </div>
  );
}
