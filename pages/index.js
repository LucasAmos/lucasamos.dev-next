import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import lucas from "../public/images/lucas3.jpeg";

import {
  faLinkedin,
  faGithub,
  faFlickr,
} from "@fortawesome/free-brands-svg-icons";
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
        <title>Lucas Amos</title>

        <meta property="og:image" content="images/lucas.jpeg" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={title} />
        <meta property="og:url" content="www.lucasamos.dev" />
        <meta property="og:author" content="Lucas Amos" />
      </Head>

      <div className="lg:grid sm:grid-cols-1 lg:grid-cols-5 gap-4 max-w-[1500px] lg:ml-20 ml-5 mr-5 mt-5 sm:mt-0">
        <div className="lg:col-span-1">
          <div className="lg:grid lg:grid-cols-1 grid-cols-2">
            <div className="col-span-1 float-left mr-10">
              <div
                className="rounded-full radius overflow-hidden lg:w-[130px] lg:h-[130px] w-[80px] h-[80px]"
                style={{
                  boxShadow:
                    "0 0 0 3px #18981a, 0 0 0 6px #880990, 0 0 0 9px #4a2051",
                }}
              >
                <Image src={lucas} alt="image of lucas amos"></Image>
              </div>
            </div>
            <div className="col-span-1">
              <h3 className="lg:pt-5 text-2xl font-bold text-slate-700">
                Lucas Amos
              </h3>
              <h4>Full-Stack Cloud Software Engineer</h4>
            </div>
          </div>
          <div className="hidden lg:block">
            <a href="https://www.linkedin.com/in/lucasamos/" target="_blank">
              <div>
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="fa-lg text-[#007bb6] mr-2 mt-3"
                />
                LinkedIn
              </div>
            </a>
            <a href="https://github.com/LucasAmos/" target="_blank">
              <div>
                <FontAwesomeIcon
                  icon={faGithub}
                  className="fa-lg text-[#383738] mr-1 mt-3 right-px relative"
                />
                GitHub
              </div>
            </a>
            <a
              href="https://www.flickr.com/photos/181849230@N04/"
              target="_blank"
            >
              <div>
                <FontAwesomeIcon
                  icon={faFlickr}
                  className="fa-lg text-[#000000] mr-2 mt-3"
                />
                Flickr
              </div>
            </a>
          </div>
        </div>

        <div className="lg:col-span-3 mt-10 lg:mt-0">
          {/* <div className="flex justify-between"> */}
          <h1 className="font-Inter text-[#1a202c] tracking-tight text-2xl font-medium">
            Recent posts
          </h1>
          {/* </div> */}

          <hr className="mt-4" />
          <div className="pt-10">
            {allPostsData.map(({ id, date, title, subtitle }) => (
              <div className="pb-10" key={title}>
                <Link href={`/articles/${id}`}>
                  <a>
                    <h1 className="text-2xl font-semibold mb-1 hover:underline underline text-purple-700  transition-all duration-1000 hover:text-purple-900">
                      {title}
                    </h1>
                    <div className="text-slate-700 text-sm mb-1">
                      <Date dateString={date} />
                    </div>
                    <div>{subtitle}</div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1" />
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
