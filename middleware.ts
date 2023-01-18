import { NextResponse, NextRequest } from "next/server";

import { rateLimit } from "./lib/ratelimit";

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type MiddlewareRequest = Override<
  NextRequest,
  {
    ip: string;
    body: { nextUrl: { pathname: string } };
  }
>;

export async function middleware(request: MiddlewareRequest): Promise<NextResponse> {
  if (request.nextUrl.pathname === "/api/email") {
    const allowRequest = await rateLimit(request.ip);

    if (allowRequest === false) {
      const url = request.nextUrl.clone();
      url.pathname = "/api/tooManyRequests";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}
