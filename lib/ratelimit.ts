import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
} from "@aws-sdk/client-dynamodb";

export async function rateLimit(ip: string): Promise<boolean> {
  const ddbClient = new DynamoDBClient({
    region: "eu-west-2",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });

  const record = await getPastRequests(ip, ddbClient);

  if (record === null) {
    await putRequests(ip, [new Date()], ddbClient);
    return true;
  } else {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    const previousRequests = filterDates(record, yesterday);
    if (previousRequests.length < 5) {
      await putRequests(ip, previousRequests.concat([new Date()]), ddbClient);
      return true;
    } else {
      return false;
    }
  }
}

export function filterDates(dates: Date[], startDate: Date): Date[] {
  return dates.filter((date) => {
    return date > startDate;
  });
}

export async function putRequests(
  ip: string,
  dates: Date[],
  client: any
): Promise<PutItemCommandOutput> {
  const putItemParams: PutItemCommandInput = {
    TableName: "rate-limits",
    Item: { ip: { S: ip }, log: { S: JSON.stringify(dates) } },
  };
  return client.send(new PutItemCommand(putItemParams));
}

export async function getPastRequests(ip: string, client: any): Promise<Date[]> {
  const getItemParams: GetItemCommandInput = {
    TableName: "rate-limits",
    Key: {
      ip: {
        S: ip,
      },
    },
  };

  const res = await client.send(new GetItemCommand(getItemParams));

  if (res?.Item?.log?.S) {
    return JSON.parse(res.Item.log.S).map((date) => new Date(date));
  }
  return null;
}
