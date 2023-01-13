import Link from "next/link";
import Sidebar from "../pages/sidebar";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

export default function Layout({ children, home }) {
  return (
    <>
      <nav className="flex sm:justify-center space-x-4 float-right sm:m-4 m-4">
        {[
          ["Posts", "/"],
          ["About me", "/about"],
          ["Contact", "/contact"],
        ].map(([title, url]) => (
          <a
            key={title}
            href={url}
            className="md:!mr-[50px] text-xl group transition duration-300 rounded-lg text-slate-700 font-medium"
          >
            {title}
            <span className="block max-w-0 md:group-hover:max-w-full  transition-all duration-500 h-1 bg-purple-700"></span>
          </a>
        ))}
      </nav>
      <div className="clear-both">
        <hr />
      </div>
      <div className="max-w-[1380px] m-auto">
        <div className="p-5 lg:grid sm:grid-cols-1 lg:grid-cols-5 gap-4 max-w-[1500px] lg:ml-20  mt-5 lg:pt-10 sm:mt-0">
          <Sidebar />
          <div className="lg:col-span-3 mt-14 lg:mt-0">{children}</div>
        </div>
      </div>
    </>
  );
}
