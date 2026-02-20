import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import lucas from "../../public/images/lucasnew.jpg";
import Link from "next/link";
import { faGithub, faFlickr } from "@fortawesome/free-brands-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

export default function Sidebar(): ReactNode {
  return (
    <div className="pt-2.5 lg:col-span-1">
      <div className="relative lg:sticky lg:top-14">
        <div className="grid-cols-2 lg:grid lg:grid-cols-1">
          <div className="col-span-1 float-left mr-10">
            <Link href="/">
              <div
                className="size-[80px] cursor-pointer overflow-hidden rounded-full lg:size-[130px]"
                style={{
                  boxShadow: "0 0 0 3px #18981a, 0 0 0 6px #880990, 0 0 0 9px #4a2051"
                }}
              >
                <Image
                  priority
                  placeholder="blur"
                  src={lucas}
                  alt="image of lucas amos"
                  sizes="(max-width: 768px) 20vw, (max-width: 1200px) 20vw, 30vw"
                  width={4000}
                  height={4169}
                />
              </div>
            </Link>
          </div>
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-slate-700 lg:pt-5">Lucas Amos</h3>
            <h4 data-testid="heading4">AWS Application Architect</h4>
          </div>
        </div>
        <div className="hidden lg:block">
          <Link href="https://github.com/LucasAmos/" target="_blank">
            <FontAwesomeIcon
              icon={faGithub}
              className="fa-lg relative right-px mr-1 mt-3 text-[#383738]"
            />
            <span>GitHub</span>
          </Link>
          <Link href="https://www.flickr.com/photos/181849230@N04/" target="_blank">
            <div>
              <FontAwesomeIcon icon={faFlickr} className="fa-lg mr-2 mt-3 text-[#000000]" />
              Flickr
            </div>
          </Link>
          <Link href="/books">
            <FontAwesomeIcon
              icon={faBook}
              className="fa-lg relative right-px mr-1 mt-3 text-[#383738]"
            />
            <span>What I&apos;m reading</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
