import Link from "next/link";

export default function Layout({ children, home }) {
  return (
    <div className="">
      <div className="grid place-items-center">
        <div className="pl-6 pr-6 pt-6 sm:p-12 md:p-6 md:pt-20">
          {children}
          {!home && (
            <Link href="/">
              <a className="sm: text-2xl lg:text-xl">← Back to home</a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
