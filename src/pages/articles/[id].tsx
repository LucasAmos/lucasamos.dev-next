import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import PropTypes from "prop-types";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import { ParsedUrlQuery } from "querystring";

const PostPropTypes = {
  postData: {
    title: PropTypes.string,
    previewImage: PropTypes.string,
    date: PropTypes.string,
    contentHtml: PropTypes.string,
  },
};

type PostTypes = PropTypes.InferProps<typeof PostPropTypes>;

const Post: React.FC = ({ postData }: PostTypes) => {
  const { previewImage, title } = postData;

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-vsc-dark-plus.min.css"
          integrity="sha512-ML8rkwYTFNcblPFx+VLgFIT2boa6f8DDP6p6go4+FT0/mJ8DCbCgi6S0UdjtzB3hKCr1zhU+YVB0AHhIloZP8Q=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta property="og:image" content={`/${previewImage}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={title} />
      </Head>

      <div>
        <article className="prose">
          <h1 className="font-Inter text-3xl sm:text-4xl">{postData.title}</h1>
          <div className="text-2xl md:text-xl text-slate-500">
            <Date dateString={postData.date} />
          </div>
          <div
            className=" break-words text-mob md:text-lg lg:text-lg"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
        </article>
      </div>
    </Layout>
  );
};

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

Post.propTypes = PostPropTypes;
export default Post;
