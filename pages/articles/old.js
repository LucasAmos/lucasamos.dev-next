import Link from "next/link";
import Date from "../../components/date";
import Image from "next/image";
import { getSortedPostsData } from "../../lib/posts";
import Layout from "../../components/layout";

export default function Blog({ allPostsData }) {
  return (
    <Layout>
      <div className="grid space-x-1 lg:grid-cols-1 bg-red-200">
        {allPostsData.map(({ id, date, title, previewImage }) => (
          <div key={id} className="lg:p-4 md:p-4 s:p-5 grid lg:grid-cols-4">
            <div className="lg:col-span-1 bg-slate-300">
              <Link href={`/articles/${id}`}>
                <a>
                  <div style={{ width: "100%" }}>
                    <Image
                      objectFit="cover"
                      layout="responsive"
                      width={600}
                      height={314}
                      src={`/${previewImage}`}
                    />
                    <Date dateString={date} />
                  </div>
                </a>
              </Link>
            </div>
            <div className="lg:col-span-3 bg-slate-200"> {title}</div>
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
