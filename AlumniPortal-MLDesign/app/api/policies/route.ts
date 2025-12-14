import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";
import { getSystemLogger } from "@/lib/logger-factory";

// Define the shape of the policy file object
type PolicyFile = {
  filename: string;
  filepath: string;
};

export async function GET(req: Request) {
  // 1. Initialize the logger
  // We use lowercase tags to ensure compatibility with your logging system's preferences
  const logger = await getSystemLogger({
    tags: ["policies", "azure_blob"],
  });

  // 2. Log Start
  const { startTime } = logger.logStart("GET_Policies");

  try {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const containerName = process.env.AZURE_CONTAINER_NAME;
    const sasToken = process.env.AZURE_SAS_TOKEN;

    if (!accountName || !containerName || !sasToken) {
      const errMsg = "Missing Azure configuration";
      console.error(errMsg);
      
      // Log specific config error
      await logger.logError("GET_Policies_Config", new Error(errMsg));
      
      return NextResponse.json(
        { error: "Azure configuration missing" },
        { status: 500 }
      );
    }

    const blobServiceUrl = `https://${accountName}.blob.core.windows.net?${sasToken}`;
    const blobServiceClient = new BlobServiceClient(blobServiceUrl);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const policyFiles: PolicyFile[] = [];
    
    // List all blobs in the container
    for await (const blob of containerClient.listBlobsFlat()) {
      const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blob.name}?${sasToken}`;
      // Remove extension for the display name
      const filenameWithoutExtension = blob.name.replace(/\.[^/.]+$/, "");
      
      policyFiles.push({
        filename: filenameWithoutExtension,
        filepath: blobUrl,
      });
    }

    // Sort alphabetically
    policyFiles.sort((a, b) => a.filename.localeCompare(b.filename));

    // 3. Log Success
    logger.logEnd("GET_Policies", startTime);

    return NextResponse.json({ files: policyFiles }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching policies from Azure:", error);
    
    // 4. Log Error
    // Ensure we pass a proper Error object to the logger
    const errObj = error instanceof Error ? error : new Error(String(error));
    await logger.logError("GET_Policies", errObj);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch policies" },
      { status: 500 }
    );
  }
}