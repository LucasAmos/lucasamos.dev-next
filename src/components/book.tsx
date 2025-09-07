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
  return (
    <h1 className="text-terf-purple font-Inter xs:text-sm sm:text-lg lg:text-xl">{children}</h1>
  );
}

function Author({ children }: { children: ReactNode }): ReactNode {
  return (
    <div>
      <h1 className="text-terf-purple font-Inter xs:text-sm sm:text-base lg:text-base">
        {children}
      </h1>
    </div>
  );
}

function Category({ children }: { children: ReactNode }): ReactNode {
  if (!children) return null;
  return (
    <div className="xs:float-left sm:float-right mr-2 inline-block rounded-md border-[1px]  border-terf-violet text-terf-violet p-1">
      {children}
    </div>
  );
}
function Container({ children }: { children: ReactNode }): ReactNode {
  return <div className="mb-2 mr-2 rounded-md border-[1px] border-terf-violet p-2">{children}</div>;
}

function Duration({
  startDate,
  finishDate,
}: {
  startDate: string;
  finishDate?: string | null | undefined;
}): ReactNode {
  if (!finishDate)
    return <h2 className="font-Inter text-xs text-terf-darkgreen sm:text-sm">Currently reading</h2>;

  return (
    <h2 className="font-Inter text-xs text-terf-violet sm:text-sm">
      {formatDate(startDate!)}
      {finishDate && ` - ${formatDate(finishDate)}`}
    </h2>
  );
}

export function BookView({ book }: { book: Book }): ReactNode {
  const { _id, category, title, author, startDate, finishDate } = book;
  const categoryName = category?.name;

  return (
    <Container key={_id}>
      <Title>{title}</Title>
      <Author>{author.name}</Author>
      <Duration startDate={startDate} finishDate={finishDate}></Duration>
      <Category>{categoryName}</Category>
    </Container>
  );
}
