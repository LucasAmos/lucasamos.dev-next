import { handleMcpRequest } from "@/mcp/server";

export const runtime = "nodejs";

export const GET = handleMcpRequest;
export const HEAD = handleMcpRequest;
