import Head from "next/head";
import Layout from "../components/layout";
const title = "Lucas Amos: AWS certified Senior Cloud Software Engineer";

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
      <h1 className="font-Inter text-[#1a202c] tracking-tight text-2xl font-medium">
        About
      </h1>
    </Layout>
  );
}
