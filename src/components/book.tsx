import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare, faHeadphones } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { BOOKS_BY_YEAR_QUERYResult } from "../../sanity.types";

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
  return <h1 className="text-t-purple font-Inter xs:text-sm sm:text-lg lg:text-xl">{children}</h1>;
}

function Author({ children }: { children: ReactNode }): ReactNode {
  return (
    <div>
      <h1 className="text-t-purple font-Inter xs:text-sm sm:text-base lg:text-base">{children}</h1>
    </div>
  );
}

function Category({ children }: { children: ReactNode }): ReactNode {
  if (!children) return null;
  return (
    <div className="flex flex-col justify-end">
      <div className="text-nowrap pr-1 pl-1 rounded-md border-[1px] border-t-violet text-t-violet">
        {children}
      </div>
    </div>
  );
}

function Container({ children }: { children: ReactNode; url: string | null }): ReactNode {
  return (
    <div className="flex flex-col  mb-2 mr-2 rounded-md border-[1px] border-t-violet p-2">
      {children}
    </div>
  );
}

function Url({ href }: { href: string }): ReactNode {
  return (
    <a href={href} target="blank" className="inline-flex">
      <FontAwesomeIcon icon={faUpRightFromSquare} />
    </a>
  );
}

function AudioBook(): ReactNode {
  return <FontAwesomeIcon icon={faHeadphones} />;
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
  if (!finishDate)
    return <h2 className="font-Inter text-xs text-t-darkgreen sm:text-sm">Currently reading</h2>;

  if (estimated) {
    return <h2 className="font-Inter text-xs text-t-violet sm:text-sm">{getMonth(finishDate)}</h2>;
  }

  return (
    <h2 className="font-Inter text-xs text-t-violet sm:text-sm">
      {formatDate(startDate!)}
      {finishDate && ` - ${formatDate(finishDate)}`}
    </h2>
  );
}

export function BookView({ book }: { book: BOOKS_BY_YEAR_QUERYResult[number] }): ReactNode {
  const { _id, audiobook, category, estimated, title, author, startDate, finishDate, url } = book;
  const categorySlug = category?.slug?.current;
  const categoryName = category?.name;
  console.log(categorySlug);
  return (
    <Container key={_id} url={url}>
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex-row flex justify-between">
          <div>
            <Title>{title}</Title>
            <Author>{author?.name}</Author>
          </div>
          <div className="flex pt-1">
            {audiobook && <AudioBook />}
            {url ? <Url href={url} /> : <div />}
          </div>
        </div>
        <div className="flex-row flex justify-between">
          <div className="justify-end flex-col flex">
            <Duration
              startDate={startDate}
              finishDate={finishDate}
              estimated={estimated}
            ></Duration>
          </div>
          {categoryName && (
            <Category>
              <Link href={`/books/category/${categorySlug}`}>{categoryName}</Link>
            </Category>
          )}
        </div>
      </div>
    </Container>
  );
}
