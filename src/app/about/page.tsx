import { Metadata } from "next";
import { Sanity } from "../../sanity/client";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "../../utils/portableTextComponents";
import ImageComponent from "../../components/image/imageComponent";
import { TechStack } from "../../components/techStack";

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
  const client = new Sanity();

  const { title, content, imageRow, techStack } = await client.getAbout();
  const images = imageRow?.images;
  return (
    <>
      <h1 className="mb-3 font-Inter text-3xl font-medium tracking-tight text-[#1a202c]">
        {title}
      </h1>

      <PortableText value={content} components={portableTextComponents} />
      <div className="w-full ">{techStack && <TechStack stack={techStack.techStackSection} />}</div>
      <div className="w-full lg:w-11/12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-start">
          {images!.map((image) => (
            <div key={image._key} className="w-full">
              <ImageComponent image={image} width={300} height={300} />
            </div>
          ))}
        </div>{" "}
      </div>
    </>
  );
};

export default About;
