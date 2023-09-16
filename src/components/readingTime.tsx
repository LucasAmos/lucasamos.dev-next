import PropTypes from "prop-types";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockFour as faClock } from "@fortawesome/free-solid-svg-icons";

type ReadingTimeProps = {
  time: string;
};

export default function ReadingTime({ time }: ReadingTimeProps): React.ReactElement {
  return (
    <div>
      <FontAwesomeIcon icon={faClock} /> {time} minute read
    </div>
  );
}

ReadingTime.displayName = "ReadingTime";

ReadingTime.propTypes = {
  time: PropTypes.number,
};
