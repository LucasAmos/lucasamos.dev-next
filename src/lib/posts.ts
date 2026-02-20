import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { calculateReadingTime } from "./utils";

const postsDirectory = path.join(process.cwd(), "src/posts");

type PostData = {
  readingTime: number;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  previewImage: string;
  contentHtml: string;
};
type AllPostsData = {
  readingTime: number;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  previewImage: string;
};

export function getSortedPostsData(): AllPostsData[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Re move ".md" from file name to get id
    const slug = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const { data } = matterResult;
    const { title, subtitle, date, previewImage } = data;
    // Combine the data with the id
    return {
      readingTime: calculateReadingTime(matterResult.content),
      slug,
      title,
      subtitle,
      date,
      previewImage,
      ...matterResult.data
    };
  });
  // Sort posts by date
  return allPostsData
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    })
    .filter((p) => {
      return new Date(p.date) <= new Date();
    });
}

export interface IPost {
  params: { slug: string };
}

export function getAllPostIds(): IPost[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, "")
      }
    };
  });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html, { sanitize: false })
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .use(require("remark-prism"), {})
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    slug,
    contentHtml,
    ...(matterResult.data as {
      title: string;
      subtitle: string;
      date: string;
      previewImage: string;
      readingTime: number;
    })
  };
}
