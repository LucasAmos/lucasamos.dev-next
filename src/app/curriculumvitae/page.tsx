import { Metadata } from "next";
import { Sanity } from "../../sanity/client";
import { draftMode } from "next/headers";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "../../utils/portableTextComponents";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lucas Amos - CV",
  description: "CV",
  openGraph: {
    title: "Lucas Amos - My CV",
    description: "About me",
    authors: ["Lucas Amos"]
  }
};

const CV: React.FC = async () => {
  const { isEnabled } = await draftMode();

  const client = new Sanity();

  const { title, content, image } = await client.getCV(isEnabled);
  return (
    <>
      <h1 className="mb-3 font-Inter text-3xl font-medium tracking-tight text-[#1a202c]">
        {title}
      </h1>
      <div className="[&_h1]:text-t-violet">
        <PortableText value={content} components={portableTextComponents} />
      </div>
    </>
  );
};

export default CV;
