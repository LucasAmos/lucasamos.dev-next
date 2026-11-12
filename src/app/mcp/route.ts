import { handleMcpRequest } from "@/mcp/server";

export const runtime = "nodejs";

export const GET = handleMcpRequest;
export const POST = handleMcpRequest;
export const DELETE = handleMcpRequest;
export const HEAD = handleMcpRequest;
export const OPTIONS = handleMcpRequest;
