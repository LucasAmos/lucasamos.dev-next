import Link from "next/link";
import {
  PortableTextMarkComponentProps,
  PortableTextComponentProps,
  PortableTextListItemComponent
} from "@portabletext/react";

export const portableTextComponents = {
  block: {
    normal: (props: PortableTextComponentProps<any>) => (
      <p className="mb-2 text-lg">{props.children}</p>
    ),
    h1: (props: PortableTextComponentProps<any>) => (
      <h1 className="font-Inter text-2xl">{props.children}</h1>
    )
  },
  list: {
    bullet: (props: PortableTextComponentProps<any>) => (
      <ul className="mb-5 ml-5 list-disc">{props.children}</ul>
    )
  },
  listItem: {
    bullet: (({ children }) => (
      <li className="mb-1">{children}</li>
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
