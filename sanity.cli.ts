import { defineCliConfig } from "sanity/cli";
export default defineCliConfig({
  typegen: {
    path: "./src/**/*.{ts,tsx,js,jsx}",
    schema: "node_modules/@lucasamos/sanity-studio/schema.json",
    generates: "sanity.types.ts"
  }
});
