import { headers } from "next/headers";
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
  if (request.nextUrl.pathname === "/posts/booksireadin2025") {
    return NextResponse.rewrite(new URL("/books/year/2025", request.url));
  }

  if (request.nextUrl.pathname === "/api/email") {
    const headersList = await headers();
    const ip = headersList.get("x-real-ip") as string;
    const allowRequest = await rateLimit(ip);

    if (allowRequest === false) {
      return new NextResponse(JSON.stringify({ success: false, message: "Rate limit exceeded" }), {
        status: 429,
        headers: { "content-type": "application/json" },
      });
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}
