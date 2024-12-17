import { lazy, ReactNode } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import Date from "../../components/date";

interface IPost {
  postData: {
    title: string;
    previewImage: string;
    date: string;
    contentHtml: string;
  };
}

const HTML = lazy(() => import("../../components/html"));

export default function Post({ postData }: IPost): ReactNode {
  const { previewImage, title } = postData;

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta property="og:image" content={`/${previewImage}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={title} />
      </Head>
      <div>
        <article className="prose">
          <h1 className="font-Inter text-3xl sm:text-4xl">{postData.title}</h1>
          <div className="text-2xl text-slate-500 md:text-xl">
            <Date dateString={postData.date} />
          </div>
          <HTML contentHtml={postData.contentHtml} />
        </article>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps<object, Params> = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const postData = await getPostData(params!.id);
  return {
    props: {
      postData,
    },
  };
};
