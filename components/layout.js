import Link from "next/link";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

export default function Layout({ children, home }) {
  return (
    <div className="">
      <div className="sm:p-12 md:p-6 md:pt-20">
        {children}
        {!home && (
          <Link href="/">
            <a className="pl-12 md:pl-5 pb-20 md:pb-10 text-4xl sm:text-2xl md:text-xl">
              ← Back to home
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
