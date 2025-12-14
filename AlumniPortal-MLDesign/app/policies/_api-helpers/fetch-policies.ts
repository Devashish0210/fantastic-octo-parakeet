type PolicyFile = {
  filename: string;
  filepath: string;
};

/**
 * Fetches policy files from the Next.js API route (which proxies to Azure)
 * @returns Array of policy files with names (without extension) and URLs
 */
export async function fetchPoliciesFromAzure(): Promise<PolicyFile[]> {
  try {
    const response = await fetch("/api/policies");
    
    if (!response.ok) {
      console.error("Failed to fetch policies:", response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    
    return data.files || [];
  } catch (error) {
    console.error("Error fetching policies:", error);
    return [];
  }
}