import { Metadata } from "next";
import LucasLLM from "./components/LucasLLM";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "LucasLLM",
  description: "Lucas AI as a Service",
  openGraph: {
    title: "LucasLLM",
    description: "Lucas AI as a Service",
    authors: ["Lucas Amos"],
    images: ["https://www.lucasamos.dev/images/lucasnew.jpg"]
  }
};

export default function Suspended(): ReactNode {
  return <LucasLLM />;
}
