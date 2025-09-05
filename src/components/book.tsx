import type { ReactNode } from "react";

export type Book = {
  _id: string;
  author: { name: string };
  category: { name: string } | null;
  finishDate?: string | null;
  startDate: string;
  title: string;
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Title({ children }: { children: ReactNode }): ReactNode {
  return <h1 className="font-Inter sm:text-sm md:text-lg lg:text-xl">{children}</h1>;
}

function Author({ children }: { children: ReactNode }): ReactNode {
  return (
    <div>
      <h1 className="font-Inter text-gray-800 sm:text-sm md:text-lg lg:text-lg">{children}</h1>
    </div>
  );
}

function Duration({
  startDate,
  finishDate,
}: {
  startDate: string;
  finishDate?: string | null | undefined;
}): ReactNode {
  return (
    <h2 className="font-Inter text-xs text-gray-800 md:text-sm">
      {formatDate(startDate!)}
      {finishDate && ` - ${formatDate(finishDate)}`}
    </h2>
  );
}

export function BookView({ book }: { book: Book }): ReactNode {
  const { _id, category, title, author, startDate, finishDate } = book;
  const categoryName = category?.name;

  return (
    <div className="mb-2 mr-2 rounded-md bg-zinc-50 p-2" key={_id}>
      <Title>{title}</Title>
      <Author>{author.name}</Author>
      <Duration startDate={startDate} finishDate={finishDate}></Duration>
      {categoryName && (
        <div className=" float-right mr-2 inline-block rounded-md  bg-zinc-100 p-1">
          {categoryName!}
        </div>
      )}
    </div>
  );
}
