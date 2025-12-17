// Import necessary modules and components
import { redirect } from "next/navigation";
import Chat from "@/components/chatComponents/Chat";
import { getCurrentSession } from "@/lib/session";

// Main page component for Chat
export default async function Home() {
  // get the session to check if the user is authenticated
    const session = await getCurrentSession();

  // if not authenticated, redirect to the login page
  if (!session) {
    redirect("/");
  }

  return (
      <div>
        <Chat />
      </div>
  );
}
