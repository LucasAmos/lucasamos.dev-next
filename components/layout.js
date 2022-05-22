import Link from "next/link";

export default function Layout({ children, home }) {
  return (
    <div className="grid place-items-center">
      <div className="sm:p-12 md:p-6 md:pt-20">
        {children}
        {!home && (
          <Link href="/">
            <a className="pl-12 pb-20 md:pb-10 text-4xl sm:text-2xl md:text-xl">
              ← Back to home
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
