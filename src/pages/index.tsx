import { ReactNode } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Layout from "../components/layout";
import ReadingTime from "../components/readingTime";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
const title = "Lucas Amos: AWS Application Architect";

type PostsData = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  readingTime: string;
};

interface HomeProps {
  allPostsData: PostsData[];
}

export default function Home({ allPostsData }: HomeProps): ReactNode {
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
      <h1 className="font-Inter text-2xl font-medium tracking-tight text-[#1a202c]">
        Recent posts
      </h1>

      <hr className="mt-4" />
      <div className="pt-10">
        {allPostsData.map(({ id, date, title, subtitle, readingTime }) => (
          <div className="pb-10" key={title}>
            <Link href={`/articles/${id}`}>
              <h1 className="mb-1 text-2xl font-semibold text-purple-700 underline transition-all  duration-1000 hover:text-purple-900 hover:underline">
                {title}
              </h1>
              <div className="mb-1 text-sm text-slate-700">
                <div className="clear-both">
                  <div className="float-left">
                    <FontAwesomeIcon icon={faCalendarAlt} className="pr-2" />
                  </div>
                  <div className="float-left pr-5">
                    <Date dateString={date} />
                  </div>
                  <div>
                    <ReadingTime time={readingTime} />
                  </div>
                </div>
              </div>
              <div className="break-words">{subtitle}</div>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      allPostsData: getSortedPostsData(),
    },
  };
};
