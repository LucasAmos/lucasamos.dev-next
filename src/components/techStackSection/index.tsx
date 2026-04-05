type TechStackProps = {
  skills: Array<string>;
  title: string;
};

export const TechStackSection = ({ title, skills }: TechStackProps) => {
  return (
    <>
      <div className="p-2 border border-t-violet rounded-sm flex-col grow">
        <div>
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
