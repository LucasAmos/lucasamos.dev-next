import { McpUseProvider, useWidget, type WidgetMetadata } from "mcp-use/react";
import { z } from "zod";

import Books from "../../../app/books/books";

const propsSchema = z.object({
  books: z.array(z.unknown()),
  finished: z.number(),
  inprogress: z.number()
});

type Props = z.infer<typeof propsSchema>;

export const widgetMetadata: WidgetMetadata = {
  description: "The books Lucas Amos has read this year, rendered inside the MCP widget iframe.",
  props: propsSchema
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
