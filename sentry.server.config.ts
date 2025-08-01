// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://438c2706b7bcd0567bf77b5fdb0f757e@o4506048468287488.ingest.us.sentry.io/4506048471695360",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  sendDefaultPii: true,
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
