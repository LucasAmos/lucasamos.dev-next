import {
  SESv2Client,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-sesv2";

const client = new SESv2Client({ region: "eu-west-2" });

const params: SendEmailCommandInput = {
  FromEmailAddress: "contact@lucasamos.dev",
  Destination: {
    ToAddresses: ["contact@lucasamos.dev"],
  },
  Content: {
    Simple: {
      Subject: {
        Data: "message from website",
      },
      Body: {
        Text: {
          Data: "hello",
        },
      },
    },
  },
};

export default async (req, res) => {
  try {
    const command = new SendEmailCommand(params);

    const data = await client.send(command);
    res.status(200).json(JSON.stringify(data));
  } catch (error) {
    res.status(200).json(JSON.stringify(error));
  }
};
