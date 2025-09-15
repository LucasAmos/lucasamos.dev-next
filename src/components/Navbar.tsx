"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../styles/global.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

const links = [
  ["Posts", "/"],
  ["About me", "/about"],
  ["Contact", "/contact"],
];

export default function Navbar(): JSX.Element {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="hidden float-right m-4 lg:flex space-x-4 sm:m-4 sm:justify-center">
        {links.map(([title, url]) => (
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
      <nav className="float-right space-x-4 m-4 sm:justify-center">
        <div className="float-right">
          <FontAwesomeIcon
            icon={open ? faClose : faBars}
            className="lg:hidden"
            onClick={() => {
              setOpen(!open);
            }}
          />
        </div>
        {open && (
          <div className="mt-6 ">
            {[...links, ["What I'm reading", "/reading"]].map(([title, url]) => (
              <Link
                key={title}
                href={url}
                className="group rounded-lg text-xl font-medium text-slate-700 transition duration-300 md:!mr-[50px]"
              >
                {title}
                <span className="block h-1 max-w-0  bg-purple-700 transition-all duration-500 md:group-hover:max-w-full"></span>
              </Link>
            ))}
          </div>
        )}
      </nav>
      <div className="clear-both">
        <hr />
      </div>
    </>
  );
}

Navbar.displayName = "Navbar";
