import { MCPServer, text, widget } from "mcp-use/server";
import { z } from "zod";
import { Sanity } from "@/sanity/client";

const client = new Sanity();

const server = new MCPServer({
  name: "nextjs-dropin-template",
  version: "0.1.0",
  description:
    " MCP server living alongside a Next.js app at src/mcp/. Renders the books read this year."
});

server.tool(
  {
    name: "show_books_read_this_year",
    description:
      "Render all of the books that Lucas Amos has been read this year using the same component that the next.js website renders.",
    schema: z.object({}),
    widget: {
      name: "books_read",
      invoking: "Loading the books...",
      invoked: "Books are ready"
    }
  },
  async () => {
    const { books, finished, inprogress } = await client.getDetailedBooksReadThisYear();

    return widget({
      props: { books, finished, inprogress },
      output: text(
        "Rendered the Next.js starter page inside the MCP widget — same React component as src/app/page.tsx."
      )
    });
  }
);

server.listen().then(() => {
  console.log("[mcp] nextjs-dropin-template server ready");
});
