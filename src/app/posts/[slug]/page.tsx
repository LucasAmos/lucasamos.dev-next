export const dynamic = "force-static";
import { getAllPostIds, getPostData, IPost } from "../../../lib/posts";
import Date from "../../../components/date";
import { Metadata } from "next";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;

  const post = await getPostData(params.slug);

  const imageUrl = `https://www.lucasamos.dev/${post.previewImage}`;

  return {
    description: post.subtitle,
    title: post.title,
    openGraph: {
      authors: ["Lucas Amos"],
      description: post.subtitle,
      images: [imageUrl],
      publishedTime: post.date,
      title: post.title,
    },
  };
}

export default async function Page(props: Params): Promise<React.JSX.Element> {
  const { slug } = await props.params;
  const { title, date, contentHtml } = await getPostData(slug);

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

export async function generateStaticParams(): Promise<IPost[]> {
  return getAllPostIds();
}
