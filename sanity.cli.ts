import { defineCliConfig } from "sanity/cli";
export default defineCliConfig({
  typegen: {
    path: "./src/**/*.{ts,tsx,js,jsx}",
    schema: "/Users/lucasamos/code/sanity-studio/studio/schema.json",
    generates: "sanity.types.ts"
  }
});
