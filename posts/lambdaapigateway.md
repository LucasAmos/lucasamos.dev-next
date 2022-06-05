---
title: Create a web scraping API using AWS Lambda and API Gateway
subtitle: 'Get authoritative near real-time stock market data without an expensive license "'
date: "2021-09-22"
previewImage: images/gatewaylambda.png
---

#### Financial APIs are expensive. While there are some free ones such as Yahoo Finance these can be unreliable. Using AWS Lambda and API Gateway you can scrape the [BBCs Morningstar access](https://www.bbc.co.uk/news/business/market-data) and create your own API to to get near real-time stock market prices.

&NewLine;

## How it works

Using a combination of [Axios](https://www.npmjs.com/package/axios) and the npm package [node-html-parser](https://www.npmjs.com/package/node-html-parser) we can use [CSS selectors](https://www.w3schools.com/cssref/css_selectors.asp) to programatically extract information from the DOM.

## The risks

Basing an API on a web page that is outside of your control is an inherently risky proposition. If the URL or the structure of the
DOM were to change then the scraping function would need to be rewritten and there is no guarantee that the required
change would be simple. With those caveats in mind we can examine the source of the [BBC market data](https://www.bbc.co.uk/news/business/market-data) page to identify the following factors that will be essential when parsing the page.

1. The data for each market is contained a row with the css class **.nw-c-md-overview-table\_\_row**
2. The first 13 rows contain market data and the remaining rows contain currency data.
3. The market name is contained in **.nw-c-md-overview-table\_\_link > span**
4. The market value, change and percentage change is contained in an element with the class **.nw-c-md-overview-table\_\_cell-inner**

Using this information we can write the following function **getMarkets()** that will return an array of market data values.

```javascript
async function getMarkets(): Promise<Market[]> {
    const TABLE_CLASS: string = '.nw-c-md-overview-table__row';
    const html: AxiosResponse = await fetch();
    const root = parse(html.data);

    const markets = [];

    for (let i = 0; i < 13; i++) {
      const row: HTMLElement = root.querySelectorAll(TABLE_CLASS)[i];
      const name: string = row
        .querySelector('.nw-c-md-overview-table__link')
        .querySelector('span').text;

      const percentChange: string = root
        .querySelectorAll(TABLE_CLASS)
        [i].querySelectorAll('.nw-c-md-overview-table__cell-inner')[1].text;

      const price: number = root
        .querySelectorAll(TABLE_CLASS)
        [i].querySelectorAll('.nw-c-md-overview-table__cell-inner')[2].text as unknown as number;
      const absoluteChange: number = root
        .querySelectorAll(TABLE_CLASS)
        [i].querySelectorAll('.nw-c-md-overview-table__cell-inner')[3].text as unknown as number;

      markets.push({
        name: name.replace(/\s/g, '').toUpperCase(),
        price,
        percentChange,
        absoluteChange
      });
    }

    return markets;
  }
```

#### By filtering the information returned by the **getMarkets()** function we can obtain the price of an individual market.

```javascript
async function fetchMarket(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const { pathParameters } = event;

  if (pathParameters && pathParameters.id) {
    const { id } = pathParameters;
    const prices = await getMarkets();
    const price = prices.filter((share: Market) => share.name === id);

    if (price.length === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify(price[0]),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "invalid symbol" }),
      };
    }
  }
  return {
    statusCode: 500,
    body: JSON.stringify({ error: "bad error" }),
  };
}
```

<br>

### Deploying to AWS using API Gateway and Lambda

Once the two functions have been written, they should be properly configured in **index.js** to return responses as JSON strings. This is required by Lambda and API gateway. The functions can then be deployed using the following CloudFormation file.

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Description: AWS SAM product API
Resources:
  ApiGatewayApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
  GetMarketsFunction:
    Type: AWS::Serverless::Function
    Properties:
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /markets
            Method: get
            RestApiId:
              Ref: ApiGatewayApi
      Runtime: nodejs14.x
      Handler: ./build/index.fetchMarkets
      Timeout: 30
  GetMarketFunction:
    Type: AWS::Serverless::Function
    Properties:
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /markets/{id}
            Method: get
            RestApiId:
              Ref: ApiGatewayApi
      Runtime: nodejs14.x
      Handler: ./build/index.fetchMarket
      Timeout: 30
```

<br>

### Consuming the API

We now have two endpoints, one that will return the full list of market data and one that will return a single market index. Of course scraping a website for every request is inefficient and this code should be refactored to regularly invoke the Lambda function via an AWS scheduled event and store the results in a DynamoDB database. The API Gateway can then serve the data directly from the database.

**https://xxxxxx.execute-api.eu-west-1.amazonaws.com/prod/markets**

```json
{
  "name": "FTSE100",
  "price": "7083.37",
  "percentChange": "+1.47%",
  "absoluteChange": "+102.39"
}
```

<br>

**https://xxxxxx.execute-api.eu-west-1.amazonaws.com/prod/markets/FTSE100**

```json
[
  {
      "name": "FTSE100",
      "price": "7083.37",
      "percentChange": "+1.47%",
      "absoluteChange": "+102.39"
  },
  {
      "name": "FTSE250",
      "price": "23784.54",
      "percentChange": "+0.73%",
      "absoluteChange": "+173.15"
  },
  {
      "name": "AEX",
      "price": "792.40",
      "percentChange": "+0.77%",
      "absoluteChange": "+6.09"
  }...
]
```

You can view all of the code [here](https://github.com/LucasAmos/AWS/tree/master/LambdaAPIGateway) where you can also see how I set up TypeScript to play well with eslint and prettier.
