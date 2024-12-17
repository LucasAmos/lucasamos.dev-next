import { ReactNode } from "react";

interface IHTML {
  contentHtml: string;
}

export default function Article({ contentHtml }: IHTML): ReactNode {
  return (
    <div
      className="break-words text-mob md:text-lg lg:text-lg"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
