import Image from "next/image";
import awsdevopspro from "../../../public/images/certs/devopspro.png";
import awssolutions from "../../../public/images/certs/solutions.png";
import awssecurity from "../../../public/images/certs/security.png";
import aston from "../../../public/images/uni/aston.png";
import standrews from "../../../public/images/uni/standrews.png";
import { Metadata } from "next";
import { Sanity } from "../../sanity/client";
import { draftMode } from "next/headers";
import { PortableText } from "@portabletext/react";

import { portableTextComponents } from "../../utils/portableTextComponents";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lucas Amos - About",
  description: "About me",
  openGraph: {
    title: "Lucas Amos - About",
    description: "About me",
    authors: ["Lucas Amos"],
    images: ["https://www.lucasamos.dev/images/lucas.JPG"]
  }
};

const About: React.FC = async () => {
  const { isEnabled } = await draftMode();

  const client = new Sanity();

  const { title, content } = await client.getAbout(isEnabled);
  return (
    <>
      <h1 className="mb-3 font-Inter text-2xl font-medium tracking-tight text-[#1a202c]">
        {title}
      </h1>

      <PortableText value={content} components={portableTextComponents} />

      <div className="w-full md:w-8/12 lg:w-11/12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-start">
          <div className="w-full">
            <Image src={standrews} placeholder="blur" alt="st andrews university logo" />
          </div>
          <div className="w-full">
            <Image src={aston} placeholder="blur" alt="aston university logo" />
          </div>
          <div className="w-full">
            <Image
              src={awsdevopspro}
              placeholder="blur"
              alt="aws devops professional certifiction"
            />
          </div>
          <div className="w-full justify-self-start">
            <Image
              src={awssolutions}
              placeholder="blur"
              alt="aws solutions architect professional certifiction"
            />
          </div>
          <div className="w-full justify-self-start">
            <Image
              src={awssecurity}
              placeholder="blur"
              alt="aws security specialist certifiction"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
