import { ITechStack, TechStackData } from "../components/techStack/types";

export function mapTechStackSectionProps(techStack: TechStackData[]): ITechStack[] {
  return techStack.map(({ skills, title, icon }) => {
    return { skills, title, icon: icon || null };
  });
}
