import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";

const SocialLink = ({ text, href }) => {
  return (
    <Link href={href}>
      <a target="_blank">
        <h3 className="pr-3 underline text-slate-800 hover:text-slate-500 hover:cursor-pointer">
          {text}
        </h3>
      </a>
    </Link>
  );
};

const title = "Lucas Amos: AWS certified Senior Cloud Software Engineer";

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>

        <meta property="og:image" content="images/lucas.jpeg" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={title} />
        <meta property="og:url" content="www.lucasamos.dev" />
        <meta property="og:author" content="Lucas Amos" />
      </Head>

      <div className="max-w-[768px] pl-6 pr-6 pt-6">
        <div className="flex justify-between">
          <h1 className="font-Inter text-[#1a202c] tracking-tight text-4xl font-medium pb-10">
            Lucas Amos
          </h1>
        </div>
        <div>
          <p className="pb-4 text-xl">
            Hi, I'm an AWS & Terraform certified Senior Cloud Software Engineer.
            I'm based in Scotland and work at one of Europe's largest and
            fastest growing full service digital delivery consultancies. My
            stack of choice is React, Node.js, TypeScript, Jest, AWS and
            Terraform.
          </p>
          <p className="pb-2  text-xl">
            I have a Masters degree in Advanced Computer Science from the
            University of St Andrews where I worked with Code First:Girls
            teaching an introductory course in web development.
          </p>
          <p className="pb-2  text-xl">
            When I'm not writing code I like to take photos and watch Formula
            One while enjoying one of Scotland's many fine craft beers.
          </p>
        </div>

        <div className="flex text-xl">
          <SocialLink
            text="LinkedIn"
            href="https://www.linkedin.com/in/lucasamos/"
          />
          <SocialLink text="GitHub" href="https://github.com/LucasAmos/" />
          <SocialLink
            text="flickr"
            href="https://www.flickr.com/photos/181849230@N04/"
          />
        </div>

        <hr className="mt-6" />
        <div className="pt-10">
          <h1 className="text-3xl pb-4 text-slate-900">Posts</h1>
          {allPostsData.map(({ id, date, title, subtitle }) => (
            <div className="pb-10" key={title}>
              <Link href={`/articles/${id}`}>
                <a>
                  <h1 className="text-lg font-semibold mb-1 hover:underline text-slate-800">
                    {title}
                  </h1>
                  <div className="text-slate-500">
                    <Date dateString={date} />
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
