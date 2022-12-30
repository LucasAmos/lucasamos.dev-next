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
      <div className="p-5 lg:grid sm:grid-cols-1 lg:grid-cols-5 gap-4 max-w-[1500px] lg:ml-20  mt-5 lg:pt-10 sm:mt-0">
        <Sidebar />
        <div className="lg:col-span-3 mt-14 lg:mt-0">{children}</div>
      </div>
    </>
  );
}
