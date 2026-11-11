import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

const origin =
  process.argv.slice(2).find((argument) => argument !== "--") || "http://localhost:3000";

async function main() {
  const client = new Client({
    name: "mcp-for-next-js-example-client",
    version: "1.0.0"
  });
  const endpoint = new URL("/mcp", `${origin}/`);
  const transport = new StreamableHTTPClientTransport(endpoint);

  console.log("Connecting to", endpoint.toString());
  await client.connect(transport);

  console.log("Connected", client.getServerCapabilities());
  console.log("***Tools***");

  const { tools } = await client.listTools();
  console.log(tools);
  console.log("\n\n");

  const message = "Hello from the MCP client";
  console.log(`***call the echo tool with message: "${message}"***`);
  const result = await client.callTool({
    name: "echo",
    arguments: { message }
  });
  console.log("Result", result);

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
