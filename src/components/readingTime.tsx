import PropTypes from "prop-types";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockFour as faClock } from "@fortawesome/free-solid-svg-icons";

type ReadingTimeProps = {
  time: string;
};

function ReadingTime({ time }: ReadingTimeProps): React.ReactElement {
  return (
    <>
      <FontAwesomeIcon icon={faClock} /> <text>{time} minute read</text>
    </>
  );
}

ReadingTime.displayName = "ReadingTime";

ReadingTime.propTypes = {
  time: PropTypes.number,
};
export default ReadingTime;
