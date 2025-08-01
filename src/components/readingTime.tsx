import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockFour as faClock } from "@fortawesome/free-solid-svg-icons";

function ReadingTime({ time }: { time: number }): ReactElement {
  return (
    <>
      <FontAwesomeIcon icon={faClock} /> <span>{time} minute read</span>
    </>
  );
}

ReadingTime.displayName = "ReadingTime";

export default ReadingTime;
