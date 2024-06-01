// https://nextjs.org/docs/basic-features/typescript#existing-projects
declare namespace NodeJS {
  interface ProcessEnv {
    ACCESS_KEY_ID: string;
    SECRET_ACCESS_KEY: string;
    FROM_EMAIL: string;
    TO_EMAIL: string;
  }
}
