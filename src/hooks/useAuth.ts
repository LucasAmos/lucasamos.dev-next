import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

export async function useAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin");

  return session;
}
