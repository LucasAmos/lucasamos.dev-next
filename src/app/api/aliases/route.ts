import { NextResponse } from "next/server";
import { Sanity } from "../../../sanity/client";

export type EmailRequestBody = {
  name: string;
  email: string;
  message: string;
};
const client = new Sanity();

export async function GET(): Promise<Response> {
  const aliases = await client.getAliases();
  return NextResponse.json({ status: 200, aliases });
}
