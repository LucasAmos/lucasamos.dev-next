import React from "react";
import Link from "next/link";
import "../styles/global.css";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function Navbar(): JSX.Element {
  return (
    <>
      <nav className="float-right m-4 flex space-x-4 sm:m-4 sm:justify-center">
        {[
          ["Posts", "/"],
          ["About me", "/about"],
          ["Contact", "/contact"],
        ].map(([title, url]) => (
          <Link
            key={title}
            href={url}
            className="group rounded-lg text-xl font-medium text-slate-700 transition duration-300 md:!mr-[50px]"
          >
            {title}
            <span className="block h-1 max-w-0  bg-purple-700 transition-all duration-500 md:group-hover:max-w-full"></span>
          </Link>
        ))}
      </nav>{" "}
      <div className="clear-both">
        <hr />
      </div>
    </>
  );
}

Navbar.displayName = "Navbar";
