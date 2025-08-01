export const dynamic = "force-static";

import { getAllPostIds, getPostData, IPost } from "../../../lib/posts";
import Date from "../../../components/date";

interface IPageProps {
  id: string;
}

export default async function Page({
  params,
}: {
  params: Promise<IPageProps>;
}): Promise<JSX.Element> {
  const { id } = await params;
  const { title, date, contentHtml } = await getPostData(id);

  return (
    <>
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
    </>
  );
}

export async function generateStaticParams(): Promise<IPost[]> {
  return getAllPostIds();
}
