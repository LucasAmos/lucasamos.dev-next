import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  filterDates,
  getPastRequests,
  PutRequests,
  rateLimit,
} from "../../lib/ratelimit";

jest.useFakeTimers({
  now: 1673452800000,
});
const ddbMock = mockClient(DynamoDBClient);

ddbMock
  .on(PutItemCommand)
  .resolves({
    $metadata: {
      attempts: 1,
      cfId: undefined,
      extendedRequestId: undefined,
      httpStatusCode: 200,
      requestId: "1-LJBSNP0QBCJM0V0M9Q2VM98897VV4KQNSO5AEMVJF66Q9ASUAAJG",
      totalRetryDelay: 0,
    },
    Attributes: undefined,
    ConsumedCapacity: undefined,
    ItemCollectionMetrics: undefined,
  })
  .on(GetItemCommand, {
    Key: {
      ip: {
        S: "192.168.0.0",
      },
    },
  })
  .resolves({
    $metadata: {
      attempts: 1,
      cfId: undefined,
      extendedRequestId: undefined,
      httpStatusCode: 200,
      requestId: "TDJ2G5VK2Q75VKUHE0VCOJPQEFVV4KQNSO5AEMVJF66Q9ASUAAJG",
      totalRetryDelay: 0,
    },
    ConsumedCapacity: undefined,
  })
  .on(GetItemCommand, {
    Key: {
      ip: {
        S: "192.168.0.1",
      },
    },
  })
  .resolves({
    $metadata: {
      attempts: 1,
      cfId: undefined,
      extendedRequestId: undefined,
      httpStatusCode: 200,
      requestId: "TDJ2G5VK2Q75VKUHE0VCOJPQEFVV4KQNSO5AEMVJF66Q9ASUAAJG",
      totalRetryDelay: 0,
    },
    ConsumedCapacity: undefined,
    Item: {
      ip: { S: "192.168.0.1" },
      log: { S: '["2023-01-10T19:19:50.670Z","2023-01-10T19:19:50.670Z"]' },
    },
  })
  .on(GetItemCommand, {
    Key: {
      ip: {
        S: "192.168.0.3",
      },
    },
  })
  .resolves({
    $metadata: {
      attempts: 1,
      cfId: undefined,
      extendedRequestId: undefined,
      httpStatusCode: 200,
      requestId: "TDJ2G5VK2Q75VKUHE0VCOJPQEFVV4KQNSO5AEMVJF66Q9ASUAAJG",
      totalRetryDelay: 0,
    },
    ConsumedCapacity: undefined,
    Item: {
      ip: { S: "192.168.0.3" },
      log: {
        S: '["2023-01-10T11:19:50.670Z","2023-01-10T13:19:50.670Z","2023-01-10T15:19:50.670Z","2023-01-10T17:19:50.670Z","2023-01-10T19:19:50.670Z"]',
      },
    },
  })
  .on(GetItemCommand, {
    Key: {
      ip: {
        S: "192.168.0.4",
      },
    },
  })
  .resolves({
    $metadata: {
      attempts: 1,
      cfId: undefined,
      extendedRequestId: undefined,
      httpStatusCode: 200,
      requestId: "TDJ2G5VK2Q75VKUHE0VCOJPQEFVV4KQNSO5AEMVJF66Q9ASUAAJG",
      totalRetryDelay: 0,
    },
    ConsumedCapacity: undefined,
    Item: {
      ip: { S: "192.168.0.3" },
      log: {
        S: '["2023-01-10T17:00:00.0Z","2023-01-10T18:00:00.0Z","2023-01-10T19:00:00.0Z","2023-01-10T20:00:00.0Z","2023-01-10T21:00:00.0Z"]',
      },
    },
  });

describe("PutRequests", () => {
  beforeEach(() => {
    ddbMock.resetHistory();
  });
  test("Should return correct response", async () => {
    const dates = [new Date(), new Date()];

    const {
      $metadata: { requestId },
    } = await PutRequests("192.168.0.1", dates, ddbMock);
    expect(requestId).toEqual(
      "1-LJBSNP0QBCJM0V0M9Q2VM98897VV4KQNSO5AEMVJF66Q9ASUAAJG"
    );
    expect(ddbMock.commandCalls(PutItemCommand)).toHaveLength(1);
  });
});

describe("getPastRequests", () => {
  beforeEach(() => {
    ddbMock.resetHistory();
  });
  test("Returns an array of dates", async () => {
    const res = await getPastRequests("192.168.0.1", ddbMock);
    expect(ddbMock.commandCalls(GetItemCommand)).toHaveLength(1);
    expect(res).toEqual([
      new Date("2023-01-10T19:19:50.670Z"),
      new Date("2023-01-10T19:19:50.670Z"),
    ]);
  });

  test("Returns an array of dates 2", async () => {
    const res = await getPastRequests("192.168.0.0", ddbMock);
    expect(ddbMock.commandCalls(GetItemCommand)).toHaveLength(1);
    expect(res).toEqual(null);
  });
});

describe("rateLimit", () => {
  beforeEach(() => {
    ddbMock.resetHistory();
  });
  test("should return true when no rate limit records exist and should add record", async () => {
    const res = await rateLimit("192.168.0.0");
    expect(res).toEqual(true);
    expect(ddbMock.commandCalls(GetItemCommand)).toHaveLength(1);
    expect(ddbMock.commandCalls(PutItemCommand)).toHaveLength(1);
    expect(ddbMock.commandCalls(PutItemCommand)[0]["args"][0]["input"]).toEqual(
      {
        TableName: "rate-limits",
        Item: {
          ip: { S: "192.168.0.0" },
          log: { S: '["2023-01-11T16:00:00.000Z"]' },
        },
      }
    );
  });

  test("should reject request when 5 requests have happened in the previous day", async () => {
    const res = await rateLimit("192.168.0.4");
    expect(ddbMock.commandCalls(GetItemCommand)).toHaveLength(1);
    expect(res).toEqual(false);
  });

  test("should allow request when less than 5 requests have happened in the previous day", async () => {
    const res = await rateLimit("192.168.0.3");
    expect(ddbMock.commandCalls(GetItemCommand)).toHaveLength(1);
    expect(ddbMock.commandCalls(PutItemCommand)).toHaveLength(1);
    expect(ddbMock.commandCalls(PutItemCommand)[0]["args"][0]["input"]).toEqual(
      {
        TableName: "rate-limits",
        Item: {
          ip: { S: "192.168.0.3" },
          log: {
            S: '["2023-01-10T17:19:50.670Z","2023-01-10T19:19:50.670Z","2023-01-11T16:00:00.000Z"]',
          },
        },
      }
    );
    expect(res).toEqual(true);
  });
});

describe("filter dates function", () => {
  test("should remove all dates before given date", () => {
    const dates = [
      new Date("2023-01-10T13:19:50.670Z"),
      new Date("2023-01-10T15:19:50.670Z"),
      new Date("2023-01-10T17:19:50.670Z"),
      new Date("2023-01-10T19:19:50.670Z"),
      new Date("2023-01-10T11:19:50.670Z"),
    ];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

    expect(filterDates(dates, yesterday)).toEqual([
      new Date("2023-01-10T17:19:50.670Z"),
      new Date("2023-01-10T19:19:50.670Z"),
    ]);
  });
});
