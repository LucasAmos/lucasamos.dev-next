import React, { ReactNode } from "react";
import { parseISO, format } from "date-fns";

const Date = ({ dateString }: { dateString: string }): ReactNode => {
  const date = parseISO(dateString);
  return (
    <time data-testid="date" dateTime={dateString}>
      {format(date, "LLLL d, yyyy")}
    </time>
  );
};

export default Date;
