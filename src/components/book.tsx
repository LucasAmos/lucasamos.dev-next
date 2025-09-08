import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export type Book = {
  _id: string;
  author: { name: string };
  category: { name: string } | null;
  finishDate?: string | null;
  startDate: string;
  title: string;
  estimated: boolean;
  url: string | null;
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getMonth(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
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
    <div className=" mr-2 inline-block rounded-md border-[1px]  border-terf-violet text-terf-violet p-1">
      {children}
    </div>
  );
}

function Container({ children }: { children: ReactNode; url: string | null }): ReactNode {
  return (
    <div className="flex mb-2 mr-2 rounded-md border-[1px] border-terf-violet p-2">{children}</div>
  );
}

function Url({ href }: { href: string }): ReactNode {
  return (
    <div className="relative">
      <a href={href} target="blank" className="float-end relative xs:max-sm:bottom-2">
        <FontAwesomeIcon icon={faUpRightFromSquare} />
      </a>
    </div>
  );
}

function Duration({
  startDate,
  finishDate,
  estimated,
}: {
  startDate: string;
  finishDate?: string | null | undefined;
  estimated: boolean;
}): ReactNode {
  console.log(estimated);
  if (!finishDate)
    return <h2 className="font-Inter text-xs text-terf-darkgreen sm:text-sm">Currently reading</h2>;

  if (estimated) {
    return (
      <h2 className="font-Inter text-xs text-terf-violet sm:text-sm">{getMonth(startDate)}</h2>
    );
  }

  return (
    <h2 className="font-Inter text-xs text-terf-violet sm:text-sm">
      {formatDate(startDate!)}
      {finishDate && ` - ${formatDate(finishDate)}`}
    </h2>
  );
}

export function BookView({ book }: { book: Book }): ReactNode {
  const { _id, category, estimated, title, author, startDate, finishDate, url } = book;
  const categoryName = category?.name;

  return (
    <Container key={_id} url={url}>
      <div className="flex-1 flex-col flex justify-between">
        <div>
          <Title>{title}</Title>
          <Author>{author.name}</Author>
        </div>
        <div>
          <Duration startDate={startDate} finishDate={finishDate} estimated={estimated}></Duration>
        </div>
      </div>
      <div className="flex-col flex justify-between ">
        {url ? <Url href={url} /> : <div />}
        <div>
          <Category>{categoryName}</Category>
        </div>
      </div>
    </Container>
  );
}
