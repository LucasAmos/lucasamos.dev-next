import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout";
import Link from "next/link";
import awsdevopspro from "../../public/images/certs/devopspro.png";
import awssolutions from "../../public/images/certs/solutions.png";
import aston from "../../public/images/uni/aston.png";
import standrews from "../../public/images/uni/standrews.png";

const title = "Lucas Amos: AWS Application Architect";

const About: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Lucas Amos</title>
        <meta property="og:image" content="images/lucasnew.jpg" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={title} />
        <meta property="og:url" content="www.lucasamos.dev" />
        <meta property="og:author" content="Lucas Amos" />
      </Head>
      <h1 className="mb-3 font-Inter text-2xl font-medium tracking-tight text-[#1a202c]">
        About me
      </h1>
      <p className="mb-2 text-lg">
        I am a Senior Software Engineer based in Scotland with a deep interest in cloud & serverless
        technologies.
      </p>
      <p className="mb-2 text-lg">
        I hold an Undergraduate degree in Computing Science from Aston University and a Masters
        degree in Advanced Computer Science from the University of St Andrews.
      </p>
      <p className="mb-2 text-lg">
        I am a published author with my paper{" "}
        <span className="font-semibold text-purple-700 underline transition-all  duration-1000 hover:text-purple-900 hover:underline">
          <Link href="/articles/faas">The State of FaaS</Link>
        </span>{" "}
        presented at the 2024 IEEE International Conference on Cloud Computing.
      </p>

      <p className="mb-2 text-lg">
        I have broad experience across the entire technology stack, the following are just some of
        the technologies of which I have experience.
      </p>
      <ul className="mb-5 ml-5 list-disc">
        <li className="mb-1">AWS</li>
        <li className="mb-1">Terraform</li>
        <li className="mb-1">TypeScript</li>
        <li className="mb-1">Node</li>
        <li className="mb-1">Python</li>
        <li className="mb-1">Next.js</li>
        <li className="mb-1">Tailwind</li>
        <li className="mb-1">React</li>
        <li className="mb-1">Contentful</li>
      </ul>
      <div className="w-full md:w-8/12 lg:w-11/12 ">
        <div className="float-left w-1/2 sm:w-1/4">
          <Image src={standrews} placeholder="blur" alt="st andrews university logo" />
        </div>
        <div className="float-left w-1/2 sm:w-1/4">
          <Image src={aston} placeholder="blur" alt="aston university logo" />
        </div>
        <div className="float-left w-1/2 sm:w-1/4">
          <Image src={awsdevopspro} placeholder="blur" alt="aws devops professional certifiction" />
        </div>
        <div className="float-left w-1/2 sm:w-1/4">
          <Image
            src={awssolutions}
            placeholder="blur"
            alt="aws solutions architect associate certifiction"
          />
        </div>
      </div>
    </Layout>
  );
};

export default About;
