"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useIsPresentationTool } from "next-sanity/hooks";
import { disableDraftMode } from "../app/actions";

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (isPresentationTool) return null;

  if (typeof window === "undefined") {
    return null;
  }

  const disable = () =>
    startTransition(async () => {
      await disableDraftMode();
      router.refresh();
    });

  return (
    <div style={{ position: "absolute", margin: 10, border: "2px solid red", padding: 5 }}>
      {pending ? (
        "Disabling draft mode..."
      ) : (
        <button type="button" onClick={disable}>
          Disable draft mode
        </button>
      )}
    </div>
  );
}
