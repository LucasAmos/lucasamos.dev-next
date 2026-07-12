import { Metadata } from "next";
import { Sanity } from "../../sanity/client";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "../../utils/portableTextComponents";
import ImageComponent from "../../components/image/imageComponent";
import { TechStack } from "../../components/techStack";
import { mapTechStackSectionProps } from "../../mapProps/techStackSection";

export const revalidate = 300;

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

  const about = await client.getAbout();

  const { title, content, imageRow, techStack } = about[0];
  const images = imageRow?.images;

  const techStackSection = techStack?.techStackSection;

  return (
    <>
      <h1 className="mb-3 font-Inter text-3xl font-medium tracking-tight text-[#1a202c]">
        {title}
      </h1>
      <PortableText value={content} components={portableTextComponents} />
      <div className="w-full ">
        {techStackSection && <TechStack stack={mapTechStackSectionProps(techStackSection)} />}
      </div>
      <div className="w-full lg:w-11/12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-start">
          {images!.map((image) => (
            <div key={image._key} className="w-full">
              <ImageComponent image={image} width={300} height={300} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default About;
