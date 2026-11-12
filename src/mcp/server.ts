import { MCPServer, text, widget } from "mcp-use/server";
import { z } from "zod";
import { Sanity } from "@/sanity/client";

process.env.MCP_USE_WIDGETS_DIR ??= "src/mcp/resources";

const server = new MCPServer({
  name: "lucas-amos-books",
  version: "1.0.1",
  description:
    "Lucas Amos's personal reading tracker. Provides information about books he has read, completed, and is currently reading, including authors, reading dates, categories, audiobooks and annual reading statistics. Use this server whenever users ask questions about Lucas Amos's reading history or reading activity."
});

server.serverPort = Number(process.env.PORT ?? 3000);

server.tool(
  {
    name: "show_books_read_this_year",
    description: `
      Retrieve Lucas Amos's actual reading history for the current year.

      MUST USE THIS TOOL when users ask questions such as:
      - What books has Lucas Amos read this year?
      - Which books has Lucas finished?
      - How many books has Lucas read?
      - What has Lucas been reading recently?
      - What audiobooks has Lucas listened to?
      - Which authors has Lucas read?
      - What are Lucas's reading statistics this year?

      Returns the actual reading records from his connected reading tracker,
      including book titles, authors, categories, start dates, finish dates,
      audiobook status and completion statistics.

      Always use this tool rather than guessing, relying on general knowledge
      or searching the public internet for Lucas's reading history.
    `,
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
      output: text(
        `Retrieved Lucas Amos's reading history for this year: ${finished} completed, ${inprogress} in progress.`
      )
    });
  }
);

const handlerPromise = server.getHandler();

export async function handleMcpRequest(request: Request): Promise<Response> {
  return (await handlerPromise)(request);
}
