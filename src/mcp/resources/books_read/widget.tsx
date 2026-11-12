import { McpUseProvider, useWidget, type WidgetMetadata } from "mcp-use/react";
import { z } from "zod";
import "./styles.css";
import Books from "../../../app/books/books";

const propsSchema = z.object({
  books: z.array(z.unknown()),
  finished: z.number(),
  inprogress: z.number()
});

type Props = z.infer<typeof propsSchema>;

// const domain = "https://comparisons-potentially-finances-lasting.trycloudflare.com";
// const domain = "http://localhost:3000"
const domain = process.env.VERCEL_URL!;

export const widgetMetadata: WidgetMetadata = {
  description: "The books Lucas Amos has read this year, rendered inside the MCP widget iframe.",
  props: propsSchema,
  metadata: {
    csp: {
      resourceDomains: [domain],
      baseUriDomains: [domain],
      connectDomains: [domain, `wss://spec-shuttle-ebook-rejected.trycloudflare.com`]
    }
  }
};

export default function DemoPageWidget() {
  const { props, isPending } = useWidget<Props>();

  if (isPending) {
    return (
      <McpUseProvider autoSize>
        <div className="p-5 text-sm text-zinc-500">Loading…</div>
      </McpUseProvider>
    );
  }

  return (
    <McpUseProvider autoSize>
      <Books {...props} />
    </McpUseProvider>
  );
}
