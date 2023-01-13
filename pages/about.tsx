import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout";
const title = "Lucas Amos: AWS certified Senior Cloud Software Engineer";
import awsdeveloper from "../public/images/certs/developer.png";
import awssysops from "../public/images/certs/sysops.png";
import awssolutions from "../public/images/certs/solutions.png";
import terraform from "../public/images/certs/terraform.png";
import scrum from "../public/images/certs/scrum.png";

export default function About() {
  return (
    <Layout home>
      <Head>
        <title>Lucas Amos</title>
        <meta property="og:image" content="images/lucas.jpeg" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={title} />
        <meta property="og:url" content="www.lucasamos.dev" />
        <meta property="og:author" content="Lucas Amos" />
      </Head>
      <h1 className="mb-3 font-Inter text-[#1a202c] tracking-tight text-2xl font-medium">
        About me
      </h1>

      <p className="text-lg mb-2">
        I'm a Cloud Software Engineed based in Scotland with a deep interest in
        serverless technologies, particulary AWS. I have broad experience across
        the entire stack including
      </p>

      <ul className="ml-5 list-disc mb-5">
        <li className="mb-1">AWS</li>
        <li className="mb-1">Terraform</li>
        <li className="mb-1">TypeScript</li>
        <li className="mb-1">Python</li>
        <li className="mb-1">Next.js</li>
        <li className="mb-1">Tailwind</li>
        <li className="mb-1">Node</li>
      </ul>
      <div className="md:w-8/12 lg:w-11/12 w-12/12 ">
        <div className="w-1/5 float-left mb-10">
          <Image
            src={awsdeveloper}
            placeholder="blur"
            alt="aws developer associate certifiction"
          />
        </div>
        <div className="w-1/5 float-left">
          <Image
            src={awssolutions}
            placeholder="blur"
            alt="aws solutions architect associate certifiction"
          />
        </div>
        <div className="w-1/5 float-left">
          <Image
            src={awssysops}
            placeholder="blur"
            alt="aws sys ops associate certifiction"
          />
        </div>
        <div className="w-1/5 float-left">
          <Image
            src={terraform}
            placeholder="blur"
            alt="terraform associate certifiction"
          />
        </div>
        <div className="w-1/5 float-left">
          <Image src={scrum} placeholder="blur" alt="scrum psm1 certifiction" />
        </div>
      </div>
    </Layout>
  );
}
