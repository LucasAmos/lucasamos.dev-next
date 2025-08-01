/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Layout from "../../../components/layout";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import Head from "next/head";
import Date from "../../../components/date";

export default async function Post({ params }: any) {
  const { title, previewImage, date, contentHtml } = await getPostData(params!.id);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={`/${previewImage}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={title} />
      </Head>

      <div>
        <article className="prose">
          <h1 className="font-Inter text-3xl sm:text-4xl">{title}</h1>
          <div className="text-2xl text-slate-500 md:text-xl">
            <Date dateString={date} />
          </div>
          <div
            className="text-mob md:text-lg lg:text-lg"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>
      </div>
    </Layout>
  );
}

export async function generateStaticParams() {
  return getAllPostIds();
}
