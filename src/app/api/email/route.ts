import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-sesv2";

const client = new SESv2Client({
  region: "eu-west-2",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
});

const bob = "";

export type EmailRequestBody = {
  name: string;
  email: string;
  message: string;
};

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as EmailRequestBody;
  const { name, email, message } = body;

  const params: SendEmailCommandInput = {
    FromEmailAddress: process.env.FROM_EMAIL,
    Destination: {
      ToAddresses: [process.env.TO_EMAIL]
    },
    Content: {
      Simple: {
        Subject: {
          Data: "message from website"
        },
        Body: {
          Text: {
            Data: `\n
            Name: ${name} \n
            email: ${email} \n
            message: ${message}`
          }
        }
      }
    }
  };

  try {
    const command = new SendEmailCommand(params);
    await client.send(command);
    return new Response("success", {
      status: 200,
      statusText: "success"
    });
  } catch {
    return Response.json({ status: 500, error: "Email was not sent" });
  }
}
