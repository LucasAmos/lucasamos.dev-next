import Head from "next/head";
import Layout from "../components/layout";
import ReadingTime from "../components/readingTime";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
const title = "Lucas Amos: AWS certified Senior Cloud Software Engineer";

export default function Home({ allPostsData }) {
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
        Recent posts
      </h1>

      <hr className="mt-4" />
      <div className="pt-10">
        {allPostsData.map(({ id, date, title, subtitle, readingTime }) => (
          <div className="pb-10" key={title}>
            <Link href={`/articles/${id}`}>
              <a>
                <h1 className="text-2xl font-semibold mb-1 hover:underline underline text-purple-700  transition-all duration-1000 hover:text-purple-900">
                  {title}
                </h1>
                <div className="text-slate-700 text-sm mb-1">
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
                <div>{subtitle}</div>
              </a>
            </Link>
          </div>
        ))}
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
