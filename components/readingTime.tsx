import PropTypes from "prop-types";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockFour as faClock } from "@fortawesome/free-solid-svg-icons";

export default function ReadingTime({ time }) {
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
