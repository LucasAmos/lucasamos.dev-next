import { ReactNode } from "react";
import ReadingTime from "../components/readingTime";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lucas Amos - AWS application architect",
  description: "Lucas Amos - AWS application architect",
  openGraph: {
    title: "Lucas Amos - AWS application architect",
    description: "Lucas Amos - AWS application architect",
    authors: ["Lucas Amos"],
    images: ["https://www.lucasamos.dev/images/lucas.JPG"]
  }
};

export default async function Home(): Promise<ReactNode> {
  const allPostsData = getSortedPostsData();
  return (
    <>
      <h1 className="font-Inter text-2xl font-medium tracking-tight text-[#1a202c]">
        Recent posts
      </h1>

      <hr className="mt-4" />
      <div className="pt-10">
        {allPostsData.map(({ slug, date, title, subtitle, readingTime }) => (
          <div className="mb-10" key={title}>
            <Link href={`/posts/${slug}`}>
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
    </>
  );
}
