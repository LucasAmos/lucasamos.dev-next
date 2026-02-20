import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { rateLimit } from "./lib/ratelimit";
import { Sanity } from "./sanity/client";
import { draftMode } from "next/headers";

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type MiddlewareRequest = Override<
  NextRequest,
  {
    ip: string;
    body: { nextUrl: { pathname: string } };
  }
>;

const client = new Sanity();

export async function proxy(request: MiddlewareRequest): Promise<NextResponse> {
  const { isEnabled } = await draftMode();

  if (request.url.includes("_next/static/") || request.url.includes("favicon.ico")) {
    return NextResponse.next();
  }
  const aliases = await client.getAliases(isEnabled);
  const matchingAlias = aliases.find((alias) => alias.source == request.nextUrl.pathname);

  if (matchingAlias) {
    const { destination } = matchingAlias;
    return NextResponse.rewrite(new URL(destination, request.url));
  }

  // const results = await client.getRewrites(isEnabled);
  // const rewrites = mapRewrites(results, routes);
  // const matchingRewrite = rewrites.find((rewrite) => rewrite?.source == request.nextUrl.pathname);

  // if (matchingRewrite) {
  //   const { destination } = matchingRewrite;
  //   return NextResponse.rewrite(new URL(destination, request.url));
  // }

  if (request.nextUrl.pathname === "/api/email") {
    const headersList = await headers();
    const ip = headersList.get("x-real-ip") as string;
    const allowRequest = await rateLimit(ip);

    if (allowRequest === false) {
      return new NextResponse(JSON.stringify({ success: false, message: "Rate limit exceeded" }), {
        status: 429,
        headers: { "content-type": "application/json" }
      });
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}
