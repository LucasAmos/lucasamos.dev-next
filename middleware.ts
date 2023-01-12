import { Request } from "express";
import { NextResponse, NextRequest } from "next/server";
import { rateLimit } from "./lib/ratelimit";

export async function middleware(request: Request, response: NextResponse) {
  if (request.nextUrl.pathname === "/api/email") {
    const allowRequest = await rateLimit(request.ip);

    if (allowRequest) {
      return NextResponse.next();
    } else {
      const url = request.nextUrl.clone();
      url.pathname = "/api/tooManyRequests";
      return NextResponse.rewrite(url);
    }
  }
}
