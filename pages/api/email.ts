import {
  SESv2Client,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-sesv2";

const client = new SESv2Client({ region: "eu-west-2" });

export default async (req, res) => {
  const { name, email, message } = req.body;

  const params: SendEmailCommandInput = {
    FromEmailAddress: process.env.EMAIL,
    Destination: {
      ToAddresses: [process.env.EMAIL],
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
    console.log(error);
    res.status(500).json(JSON.stringify({ error: "Email was not sent" }));
  }
};
