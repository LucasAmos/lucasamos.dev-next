import * as Sentry from "@sentry/nextjs";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "browser") {
    await import("../instrumentation-client");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
