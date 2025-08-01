import React, { ReactNode } from "react";
import Link from "next/link";
import Sidebar from "./sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
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
      </nav>
      <div className="clear-both">
        <hr />
      </div>
      <div className="m-auto max-w-[1380px]">
        <div className="mt-5 max-w-[1500px] gap-4 p-5 sm:mt-0 sm:grid-cols-1 lg:ml-20  lg:grid lg:grid-cols-5 lg:pt-10">
          <Sidebar />
          <div className="mt-14 lg:col-span-3 lg:mt-0">{children}</div>
          <SpeedInsights />
        </div>
      </div>
    </>
  );
};

export default Layout;

Layout.displayName = "Layout";
