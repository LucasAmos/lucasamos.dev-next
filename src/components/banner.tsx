import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const Banner: React.FunctionComponent = () => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("banner") !== "hidden") {
      setHidden(false);
    }
  }, []);

  if (!hidden) {
    return (
      <div className="sticky top-0 z-10 flex items-center justify-between bg-slate-100  dark:bg-slate-800 ">
        <div className="flex grow justify-center text-center text-lg font-semibold">
          <Link
            href="https://arxiv.org/abs/2408.03021"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            Read my IEEE CLOUD paper on The State of FaaS
          </Link>
        </div>
        <div className="float-right cursor-pointer p-2">
          <FontAwesomeIcon
            icon={faCircleXmark}
            size="xl"
            onClick={() => {
              localStorage.setItem("banner", "hidden");
              setHidden(true);
            }}
          />
        </div>
      </div>
    );
  }
};

export default Banner;

Banner.displayName = "Banner";
