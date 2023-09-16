import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import lucas from "../public/images/lucas3.jpeg";
import Link from "next/link";
import { faLinkedin, faGithub, faFlickr } from "@fortawesome/free-brands-svg-icons";

export default function Sidebar(): React.ReactElement {
  return (
    <div className="lg:col-span-1m pt-2.5">
      <div className="lg:sticky lg:top-5 relative">
        <div className="lg:grid lg:grid-cols-1 grid-cols-2">
          <div className="col-span-1 float-left mr-10">
            <Link href="/" legacyBehavior>
              <div
                className="cursor-pointer rounded-full radius overflow-hidden lg:w-[130px] lg:h-[130px] w-[80px] h-[80px]"
                style={{
                  boxShadow: "0 0 0 3px #18981a, 0 0 0 6px #880990, 0 0 0 9px #4a2051",
                }}
              >
                <Image priority placeholder="blur" src={lucas} alt="image of lucas amos" />
              </div>
            </Link>
          </div>
          <div className="col-span-1">
            <h3 className="lg:pt-5 text-2xl font-bold text-slate-700">Lucas Amos</h3>
            <h4 data-testid="heading4">Cloud Software Engineer</h4>
          </div>
        </div>
        <div className="hidden lg:block">
          <Link href="https://www.linkedin.com/in/lucasamos/" target="_blank">
            <div>
              <FontAwesomeIcon icon={faLinkedin} className="fa-lg text-[#007bb6] mr-2 mt-3" />
              LinkedIn
            </div>
          </Link>
          <Link href="https://github.com/LucasAmos/" target="_blank">
            <div>
              <FontAwesomeIcon
                icon={faGithub}
                className="fa-lg text-[#383738] mr-1 mt-3 right-px relative"
              />
              GitHub
            </div>
          </Link>
          <Link href="https://www.flickr.com/photos/181849230@N04/" target="_blank">
            <div>
              <FontAwesomeIcon icon={faFlickr} className="fa-lg text-[#000000] mr-2 mt-3" />
              Flickr
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
