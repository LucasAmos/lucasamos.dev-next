import type { ReactNode } from "react";
import { Skills } from "../skills";

type ITechStack = {
  icon: string | null;
  skills: Array<string>;
  title: string;
};

export function TechStack({ stack }: { stack: ITechStack[] }): ReactNode {
  return (
    <>
      <h2 className="text-2xl font-bold mt-10">Tech Stack</h2>
      <div className="mt-5 mb-10 gap-2 grid grid-flow-row  grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {stack.map(({ title, skills, icon }) => (
          <Skills icon={icon} key={title} title={title} skills={skills} />
        ))}
      </div>
    </>
  );
}
