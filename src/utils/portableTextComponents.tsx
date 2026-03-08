import Link from "next/link";
import { ReactNode } from "react";
import {
  PortableTextMarkComponentProps,
  PortableTextComponentProps,
  PortableTextListItemComponent
} from "@portabletext/react";

export const portableTextComponents = {
  types: {},
  block: {
    normal: (props: PortableTextComponentProps<any>) => (
      <p className="mb-2 text-lg">{props.children}</p>
    )
  },
  list: {
    bullet: (props: PortableTextComponentProps<any>) => (
      <ul className="mb-5 ml-5 list-disc">{props.children}</ul>
    )
  },

  listItem: {
    bullet: (({ children }) => (
      <li className="ml-4 list-disc">{children}</li>
    )) as PortableTextListItemComponent
  },

  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps) => {
      const rel = !value?.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <span className="font-semibold text-purple-700 underline transition-all  duration-1000 hover:text-purple-900 hover:underline">
          <Link href={value?.href} rel={rel}>
            {children}
          </Link>
        </span>
      );
    }
  }
};
