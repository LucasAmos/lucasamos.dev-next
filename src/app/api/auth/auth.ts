import NextAuth from "next-auth";
import { authConfig } from "./[...nextauth]/route";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig
});
