import React from "react";

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  return (
    <>
      {children}
      <div style={{ backgroundColor: "red", width: "100%", height: 50 }}> test </div>
    </>
  );
}

Layout.displayName = "Layout";
