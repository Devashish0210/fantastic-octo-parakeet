"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronRight,
  ChevronDown,
  Database,
  FolderClosed,
  Table as TableIcon,
  RefreshCw,
  Plus,
  Copy,
  Check,
  ScanText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  fetchConnectedDatabases,
  refreshAllDatabaseSchemas,
  syncDatabaseSchemas,
} from "@/lib/api";
import AddDatabaseComponent from "./AddDatabase";
import "../../app/globals.css";
import { cn } from "@/lib/utils";

// Define the structure of a database column
interface Column {
  id: string;
  name: string;
  schema_name: string;
  columns: string[];
  sync_status: string;
  last_sync: string;
}

// Define the structure of a database schema
interface DatabaseSchema {
  name: string;
  tables: Column[];
}

// Define the structure of a database connection
interface DatabaseConnection {
  db_connection_id: string;
  db_connection_alias: string;
  dialect: string;
  schemas: string[];
  tables: Column[];
}

// Function to format time strings into a more readable format
const formatTime = (timeString: string) => {
  try {
    const date = new Date(timeString);
    const now = new Date();

    // If it's today, show "x hours ago"
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }

    // Otherwise show the date in a nice format
    return date.toLocaleDateString();
  } catch (e) {
    return timeString;
  }
};

// Main component to view and manage connected databases
export default function DatabaseComponent() {
  const { data: session, status } = useSession();
  const [databases, setDatabases] = useState<DatabaseConnection[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Function to toggle expansion state
  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Check if an item is expanded
  const isExpanded = (id: string) => !!expandedItems[id];

  // Function to toggle table selection
  const toggleTableSelection = (tableId: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  // Function to copy ID to clipboard
  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Function to organize tables by schema
  const organizeBySchema = (db: DatabaseConnection): DatabaseSchema[] => {
    const schemaMap: Record<string, Column[]> = {};

    // Group tables by schema
    db.tables.forEach((table) => {
      if (!schemaMap[table.schema_name]) {
        schemaMap[table.schema_name] = [];
      }
      schemaMap[table.schema_name].push(table);
    });

    // Convert to array of schema objects
    return Object.keys(schemaMap).map((name) => ({
      name,
      tables: schemaMap[name],
    }));
  };

  // Function to fetch databases and handle refresh
  const fetchDatabases = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
      try {
        await refreshAllDatabaseSchemas((session as any)?.user?.accessToken);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to refresh schemas"
        );
        setRefreshing(false);
        return;
      }
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Use the utility function from utils/api.ts
      const data = await fetchConnectedDatabases(
        (session as any)?.user?.accessToken
      );
      if (!data) {
        throw new Error("Failed to fetch database details");
      }

      setDatabases(data);

      // Auto-expand the first database if this is the initial load
      if (!isRefresh && data.length > 0) {
        setExpandedItems({ [data[0].db_connection_id]: true });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch database details"
      );
      console.error("Error fetching database details:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to sync selected databases
  const syncDatabases = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = (session as any)?.user?.accessToken;
      const response = await syncDatabaseSchemas(token, selectedTables);

      if (!response) {
        throw new Error("Failed to sync schemas");
      }
      setSelectedTables([]);
      await fetchDatabases(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Schema sync failed");
      console.error("Error syncing databases:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch databases on initial load
  useEffect(() => {
    fetchDatabases();
  }, []);

  return (
    <Card
      className={cn(
        "w-full",
        "bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)]",
        "text-[var(--color-text-dark)]"
      )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Connected Databases</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            {selectedTables.length > 0
              ? `${selectedTables.length} tables selected`
              : "No tables selected"}
          </div>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8",
              "hover:bg-[var(--color-button-highlight)]",
              "hover:text-[var(--color-text-highlight)]"
            )}
            onClick={() => {
              syncDatabases();
            }}
            disabled={selectedTables.length === 0 || loading}
          >
            <ScanText className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8",
              "hover:bg-[var(--color-button-highlight)]",
              "hover:text-[var(--color-text-highlight)]"
            )}
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8",
              "hover:bg-[var(--color-button-highlight)]",
              "hover:text-[var(--color-text-highlight)]"
            )}
            onClick={() => fetchDatabases(true)}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>

      {/* Add Database Component */}
      <AddDatabaseComponent
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchDatabases}
      />

      {/* View Database Component */}
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
        ) : (
          <Table>
            <TableBody>
              {databases.map((db) => (
                <TableRow
                  key={db.db_connection_id}
                  className="hover:bg-muted/20"
                >
                  <TableCell className="p-0">
                    <div className="pl-2">
                      <Checkbox
                        checked={db.tables.every((t) =>
                          selectedTables.includes(t.id)
                        )}
                        onCheckedChange={() => {
                          const allTableIds = db.tables.map((t) => t.id);
                          const allSelected = allTableIds.every((id) =>
                            selectedTables.includes(id)
                          );

                          if (allSelected) {
                            // Unselect all tables from this DB
                            setSelectedTables((prev) =>
                              prev.filter((id) => !allTableIds.includes(id))
                            );
                          } else {
                            // Select all tables from this DB
                            setSelectedTables((prev) => [
                              ...new Set([...prev, ...allTableIds]),
                            ]);
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="p-0" colSpan={4}>
                    <Collapsible
                      open={isExpanded(db.db_connection_id)}
                      className="w-full"
                    >
                      <CollapsibleTrigger
                        onClick={() => toggleExpand(db.db_connection_id)}
                        className="flex items-center w-full py-2 hover:bg-accent/20 text-left"
                      >
                        {isExpanded(db.db_connection_id) ? (
                          <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                        )}
                        <Database className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-medium">
                          {db.db_connection_alias}
                        </span>
                        <div className="flex items-center ml-2">
                          <span className="text-xs text-muted-foreground">
                            {db.db_connection_id}
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-6 w-6 ml-1",
                                  "hover:bg-[var(--color-button-highlight)]",
                                  "hover:text-[var(--color-text-highlight)]"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(db.db_connection_id);
                                }}
                              >
                                {copiedId === db.db_connection_id ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className={cn(
                                    "h-3 w-3",
                                  )} />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copiedId === db.db_connection_id
                                ? "Copied!"
                                : "Copy ID"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CollapsibleTrigger>

                      {/* Schemas Section */}
                      <CollapsibleContent className="pl-8">
                        {organizeBySchema(db).map((schema) => (
                          <Collapsible
                            key={`${db.db_connection_id}-${schema.name}`}
                            open={isExpanded(
                              `${db.db_connection_id}-${schema.name}`
                            )}
                          >
                            <CollapsibleTrigger
                              onClick={() =>
                                toggleExpand(
                                  `${db.db_connection_id}-${schema.name}`
                                )
                              }
                              className="flex items-center py-2 hover:bg-accent/20 text-left w-full"
                            >
                              {isExpanded(
                                `${db.db_connection_id}-${schema.name}`
                              ) ? (
                                <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                              )}
                              <FolderClosed className="h-5 w-5 mr-2" />
                              <span>Schema - {schema.name}</span>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="pl-8">
                              <Collapsible
                                open={isExpanded(
                                  `${db.db_connection_id}-${schema.name}-tables`
                                )}
                              >
                                <CollapsibleTrigger
                                  onClick={() =>
                                    toggleExpand(
                                      `${db.db_connection_id}-${schema.name}-tables`
                                    )
                                  }
                                  className="flex items-center py-2 hover:bg-accent/20 text-left w-full"
                                >
                                  {isExpanded(
                                    `${db.db_connection_id}-${schema.name}-tables`
                                  ) ? (
                                    <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                                  )}
                                  <TableIcon className="h-5 w-5 mr-2" />
                                  <span>Tables</span>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                  {schema.tables.map((table) => (
                                    <Collapsible
                                      key={table.id}
                                      open={isExpanded(`table-${table.id}`)}
                                    >
                                      <CollapsibleTrigger
                                        onClick={() =>
                                          toggleExpand(`table-${table.id}`)
                                        }
                                        className="flex items-center py-2 pl-8 hover:bg-accent/20 w-full text-left"
                                      >
                                        <Checkbox
                                          className="mr-2"
                                          checked={selectedTables.includes(
                                            table.id
                                          )}
                                          onCheckedChange={(checked) => {
                                            toggleTableSelection(table.id);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        {isExpanded(`table-${table.id}`) ? (
                                          <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                                        )}
                                        <TableIcon className="h-5 w-5 mr-2" />
                                        <div className="flex flex-col flex-1">
                                          <div className="flex items-center">
                                            <span className="font-medium">
                                              {table.name}
                                            </span>
                                            <div className="flex items-center ml-2">
                                              <span className="text-xs text-muted-foreground">
                                                {table.id}
                                              </span>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={cn(
                                                      "h-6 w-6 ml-1",
                                                      "hover:bg-[var(--color-button-highlight)]",
                                                      "hover:text-[var(--color-text-highlight)]"
                                                    )}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      copyToClipboard(table.id);
                                                    }}
                                                  >
                                                    {copiedId === table.id ? (
                                                      <Check className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                      <Copy className={cn(
                                                        "h-3 w-3",
                                                      )} />
                                                    )}
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  {copiedId === table.id
                                                    ? "Copied!"
                                                    : "Copy ID"}
                                                </TooltipContent>
                                              </Tooltip>
                                            </div>
                                          </div>
                                        </div>
                                        <span className="text-sm text-muted-foreground mr-2">
                                          {formatTime(table.last_sync)}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className={`${table.sync_status === "SCANNED"
                                            ? "text-green-500 border-green-200 bg-green-50"
                                            : "text-yellow-500 border-yellow-200 bg-yellow-50"
                                            }`}
                                        >
                                          {table.sync_status}
                                        </Badge>
                                      </CollapsibleTrigger>

                                      <CollapsibleContent className="pl-16 py-2">
                                        <div className="border-l-2 border-gray-200 pl-4">
                                          <h4 className="text-sm font-medium mb-2">
                                            Columns:
                                          </h4>
                                          <div className="flex flex-col space-y-1">
                                            {table.columns &&
                                              table.columns.map(
                                                (column, idx) => (
                                                  <div
                                                    key={`${table.id}-col-${idx}`}
                                                    className="text-sm text-muted-foreground"
                                                  >
                                                    {column}
                                                  </div>
                                                )
                                              )}
                                          </div>
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                </TableRow>
              ))}

              {databases.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No databases connected
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
