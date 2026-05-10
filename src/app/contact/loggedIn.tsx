"use client";
import React from "react";
import { useSession } from "next-auth/react";

const LoggedIn: React.FC = () => {
  const { data: session, status } = useSession();
  const bob = useSession();
  console.log(session, status);

  if (status === "authenticated") {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        {JSON.stringify(bob)}
      </div>
    );
  }

  return <a href="/api/auth/signin">Sign in</a>;
};

export default LoggedIn;
