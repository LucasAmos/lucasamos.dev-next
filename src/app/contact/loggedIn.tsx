"use client";
import React from "react";
import { useSession } from "next-auth/react";

const LoggedIn: React.FC = () => {
  const { data: session, status } = useSession();
  console.log(session, status);

  if (status === "authenticated") {
    return <p>Signed in as {session.user.email}</p>;
  }

  return <a href="/api/auth/signin">Sign in</a>;
};

export default LoggedIn;
