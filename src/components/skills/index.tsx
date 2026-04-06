import * as far from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type TechStackProps = {
  icon: string | null;
  skills: Array<string>;
  title: string;
};

export const Skills = ({ icon, skills, title }: TechStackProps) => {
  return (
    <>
      <div className="p-2 border border-t-violet rounded-sm flex-col grow">
        <div>
          {icon && <FontAwesomeIcon className="mr-1" icon={far[icon as keyof typeof far] as any} />}
          <b>{title}</b>
        </div>
        {skills.map((skill) => (
          <div
            key={skill}
            className="text-sm p-1 bg-t-darkgreen/20 border-t-darkgreen border m-1 inline-grid rounded-sm"
          >
            <div className="">{skill}</div>
          </div>
        ))}
      </div>
    </>
  );
};
