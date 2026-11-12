import { MCPServer, text, widget } from "mcp-use/server";
import { z } from "zod";
import { Sanity } from "@/sanity/client";

process.env.MCP_USE_WIDGETS_DIR ??= "src/mcp/resources";

const server = new MCPServer({
  name: "nextjs-dropin-template",
  version: "0.1.0",
  description: "Renders the books read this year."
});

server.serverPort = Number(process.env.PORT ?? 3000);

server.tool(
  {
    name: "show_books_read_this_year",
    description: "Render the books Lucas Amos has read this year.",
    schema: z.object({}),
    widget: {
      name: "books_read",
      invoking: "Loading the books...",
      invoked: "Books are ready"
    }
  },
  async () => {
    const { books, finished, inprogress } = await new Sanity().getDetailedBooksReadThisYear();

    return widget({
      props: { books, finished, inprogress },
      output: text("Rendered the books read this year.")
    });
  }
);

const handlerPromise = server.getHandler();

export async function handleMcpRequest(request: Request): Promise<Response> {
  return (await handlerPromise)(request);
}
