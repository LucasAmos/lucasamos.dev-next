import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
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

export default async (req: EmailApiRequest, res: NextApiResponse): Promise<void> => {
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
    res.status(200).json("success");
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json(JSON.stringify({ error: "Email was not sent" }));
  }
};
