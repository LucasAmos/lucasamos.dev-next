import React from "react";

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  throw new Error("Bad Error");
}
