export const dynamic = "force-static";
import { cache } from "react";
import { notFound } from "next/navigation";
import { PostNotFoundError } from "@/utils/Errors";
import { getAllPostIds, getPostData, IPost } from "../../../lib/posts";
import Date from "../../../components/date";
import { Metadata } from "next";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export const getPost = cache(async (slug: string) => {
  try {
    return await getPostData(slug);
  } catch (error) {
    if (error instanceof PostNotFoundError) {
      notFound();
    }
    throw error;
  }
});

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);

  const imageUrl = `https://www.lucasamos.dev/${post.previewImage}`;

  return {
    description: post.subtitle,
    title: post.title,
    openGraph: {
      authors: ["Lucas Amos"],
      description: post.subtitle,
      images: [imageUrl],
      publishedTime: post.date,
      title: post.title
    }
  };
}

export default async function Page(props: Params): Promise<React.JSX.Element> {
  const { slug } = await props.params;

  const post = await getPost(slug);

  const { title, date, contentHtml } = post;
  return (
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
  );
}

export function generateStaticParams(): IPost[] {
  return getAllPostIds();
}
