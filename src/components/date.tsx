import React from "react";
import PropTypes from "prop-types";
import { parseISO, format } from "date-fns";

const DatePropTypes = {
  dateString: PropTypes.string.isRequired,
};

type DateTypes = PropTypes.InferProps<typeof DatePropTypes>;

const Date: React.FunctionComponent<DateTypes> = ({ dateString }) => {
  const date = parseISO(dateString);
  return (
    <time data-testid="date" dateTime={dateString}>
      {format(date, "LLLL d, yyyy")}
    </time>
  );
};

export default Date;

Date.propTypes = DatePropTypes;
