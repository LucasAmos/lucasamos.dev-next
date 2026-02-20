"use client";
import * as Sentry from "@sentry/nextjs";

import { useEffect } from "react";

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.log("**: ", error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-red-700 ">
        An error occurred and this page could not be loaded
      </h2>
    </div>
  );
}
