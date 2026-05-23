import React from "react";
import Link from "next/link";
import { generateYears } from "../../utils/years";

export default async function BookYearLinks({
  year,
  route = ""
}: {
  route?: string;
  year: number;
}): Promise<React.JSX.Element> {
  return (
    <>
      <h2 className="mb-2 mt-5 font-Inter text-xl">Past years</h2>
      <div className="grid-cols-2">
        {generateYears(year).map((year) => {
          return (
            <div key={year} className="inline-block mr-4">
              <Link
                className="text-purple-700 underline transition-all  duration-1000 hover:text-purple-900 hover:underline visited:text-purple-900"
                href={route ? `${route}/${year}` : `${year}`}
              >
                {year}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
