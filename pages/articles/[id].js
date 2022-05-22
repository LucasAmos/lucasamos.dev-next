import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";

export default function Post({ postData }) {
  const { title, previewImage } = postData;

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
          <h1 className="text-5xl sm:text-4xl">{postData.title}</h1>
          <div className="text-4xl md:text-xl text-slate-500">
            <Date dateString={postData.date} />
          </div>
          <div
            className="text-mob md:text-lg lg:text-lg"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
        </article>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
