import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout";
const title = "Lucas Amos: AWS certified Senior Cloud Software Engineer";
import awsdevopspro from "../../public/images/certs/devopspro.png";
import awsdeveloper from "../../public/images/certs/developer.png";
import awssysops from "../../public/images/certs/sysops.png";
import awssolutions from "../../public/images/certs/solutions.png";
import terraform from "../../public/images/certs/terraform.png";
import scrum from "../../public/images/certs/scrum.png";

const About: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Lucas Amos</title>
        <meta property="og:image" content="images/lucas.jpeg" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={title} />
        <meta property="og:url" content="www.lucasamos.dev" />
        <meta property="og:author" content="Lucas Amos" />
      </Head>
      <h1 className="mb-3 font-Inter text-2xl font-medium tracking-tight text-[#1a202c]">
        About me
      </h1>

      <p className="mb-2 text-lg">
        I{"'"}m a Senior Cloud Software Engineer based in Scotland with a deep interest in AWS &
        serverless technologies. I have broad experience across the entire stack including
      </p>

      <ul className="mb-5 ml-5 list-disc">
        <li className="mb-1">AWS</li>
        <li className="mb-1">Terraform</li>
        <li className="mb-1">TypeScript</li>
        <li className="mb-1">Node</li>
        <li className="mb-1">Python</li>
        <li className="mb-1">Next.js</li>
        <li className="mb-1">Tailwind</li>
      </ul>
      <div className="w-full md:w-8/12 lg:w-11/12 ">
        <div className="float-left  w-1/3  md:w-1/6 ">
          <Image src={awsdevopspro} placeholder="blur" alt="aws developer associate certifiction" />
        </div>
        <div className="float-left  w-1/3 md:w-1/6 ">
          <Image src={awsdeveloper} placeholder="blur" alt="aws developer associate certifiction" />
        </div>
        <div className="float-left w-1/3 md:w-1/6">
          <Image
            src={awssolutions}
            placeholder="blur"
            alt="aws solutions architect associate certifiction"
          />
        </div>
        <div className="float-left mt-5 w-1/3 sm:mt-10 md:mt-0 md:w-1/6">
          <Image src={awssysops} placeholder="blur" alt="aws sys ops associate certifiction" />
        </div>
        <div className="float-left  mt-5 w-1/3 sm:mt-10 md:mt-0 md:w-1/6">
          <Image src={terraform} placeholder="blur" alt="terraform associate certifiction" />
        </div>
        <div className="float-left  mt-5 w-1/3 sm:mt-10 md:mt-0 md:w-1/6">
          <Image src={scrum} placeholder="blur" alt="scrum psm1 certifiction" />
        </div>
      </div>
    </Layout>
  );
};

export default About;
