import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest } from "next";
import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-sesv2";

const client = new SESv2Client({
  region: "eu-west-2",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type EmailApiRequest = Override<NextApiRequest, { body: EmailRequestBody }>;

export type EmailRequestBody = {
  name: string;
  email: string;
  message: string;
};

export async function POST(req: Request): Promise<Response> {
  // @ts-expect-error WIP
  const { name, email, message } = req.body;

  const params: SendEmailCommandInput = {
    FromEmailAddress: process.env.FROM_EMAIL,
    Destination: {
      ToAddresses: [process.env.TO_EMAIL],
    },
    Content: {
      Simple: {
        Subject: {
          Data: "message from website",
        },
        Body: {
          Text: {
            Data: `\n
            Name: ${name} \n
            email: ${email} \n
            message: ${message}`,
          },
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await client.send(command);
    return new Response("success", {
      status: 200,
      statusText: "success",
    });
  } catch (error) {
    Sentry.captureException(error);

    return new Response(JSON.stringify({ error: "Email was not sent" }), {
      status: 500,
      statusText: "success",
    });
  }
}
