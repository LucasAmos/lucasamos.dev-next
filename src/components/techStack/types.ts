import { TechStack } from "../../../sanity.types";

export type ITechStack = {
  icon: string | null;
  skills: Array<string>;
  title: string;
};

export type TechStackData = Omit<TechStack, "_id" | "_type" | "_createdAt" | "_updatedAt" | "_rev">;
