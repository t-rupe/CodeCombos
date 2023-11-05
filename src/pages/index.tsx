import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import HomePage from "../pages/components/HomeDashboard"; // assuming you've moved the provided template into a file named HomePage.tsx
import { api } from "~/utils/api";

export default function Home() {
  // Use the session hook for authentication status
  const { data: session, status } = useSession();

  // Check if the session is loading
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  function AuthShowcase() {
    const { data: sessionData } = useSession();

    const { data: secretMessage } = api.post.getSecretMessage.useQuery(
      undefined, // no input
      { enabled: sessionData?.user !== undefined },
    );
  }

  return <>
      <HomePage/>
  </>;
}
