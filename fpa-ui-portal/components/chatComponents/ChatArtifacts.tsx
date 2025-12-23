"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Table, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import DataTable from "./DataTable";
import CustomizableGraph from "../queryComponents/customizableGraph";
import CodeDisplay from "./CodeDisplay";

interface ChatArtifactsProps {
  tableData?: {
    columns: string[];
    rows: any[][];
  } | null;
  graphData?: {
    data: any;
  } | null;
  codeData?: string | null;
}

export default function ChatArtifacts({
  tableData,
  graphData,
  codeData,
}: ChatArtifactsProps) {
  // Determine default tab based on availability, prioritizing Table -> Graph -> Code
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (tableData) return "table";
    if (graphData) return "graph";
    if (codeData) return "code";
    return "table";
  });

  const renderContent = () => {
    switch (activeTab) {
      case "table":
        return tableData ? (
          <DataTable data={tableData} />
        ) : (
          <div className="p-4 text-neutral-500">No table data available</div>
        );
      case "graph":
        return graphData ? (
          <CustomizableGraph data={graphData.data} />
        ) : (
          <div className="p-4 text-neutral-500">No graph data available</div>
        );
      case "code":
        return <CodeDisplay sqlQuery={codeData || ""} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-4 border rounded-lg p-3 border-neutral-700 bg-neutral-900">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-2 bg-neutral-800">
          <TabsTrigger
            value="table"
            disabled={!tableData}
            className={cn(
              "transition-colors",
              "data-[state=active]:bg-[var(--color-button-highlight)] data-[state=active]:text-[var(--color-text-highlight)]"
            )}
          >
            <Table className="h-4 w-4 mr-2" />
            Table
          </TabsTrigger>
          <TabsTrigger
            value="graph"
            disabled={!graphData}
            className={cn(
              "transition-colors",
              "data-[state=active]:bg-[var(--color-button-highlight)] data-[state=active]:text-[var(--color-text-highlight)]"
            )}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Graph
          </TabsTrigger>
          <TabsTrigger
            value="code"
            disabled={!codeData}
            className={cn(
              "transition-colors",
              "data-[state=active]:bg-[var(--color-button-highlight)] data-[state=active]:text-[var(--color-text-highlight)]"
            )}
          >
            <Code className="h-4 w-4 mr-2" />
            SQL
          </TabsTrigger>
        </TabsList>

        <div className="flex-grow overflow-auto border rounded-lg p-3 border-neutral-700 bg-neutral-900 max-h-[500px]">
          {renderContent()}
        </div>
      </Tabs>
    </div>
  );
}