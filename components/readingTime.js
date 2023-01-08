import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockFour as faClock } from "@fortawesome/free-solid-svg-icons";

export default function ({ time }) {
  return (
    <div>
      <FontAwesomeIcon icon={faClock} /> {time} minute read
    </div>
  );
}
