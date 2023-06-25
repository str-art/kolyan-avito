const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const ITEM = "ITEM";
const DELIMITER = "@";
const ITEM_SK = (id) => `${ITEM}${DELIMITER}${id}`;

class Dynamo {
  constructor(table_name) {
    this.table_name = table_name;
    this.client = new DynamoDB({
      region: "us-east-1",
      endpoint: "http://localstack:4566",
    });
  }

  async addItem(item, subscription) {
    return new Promise((ok, fail) => {
      this.client.putItem(
        {
          TableName: this.table_name,
          Item: {
            url: {
              S: item.url,
            },
            price: {
              N: item.price,
            },
            description: {
              S: item.description,
            },
            PK: {
              S: subscription,
            },
            SK: {
              S: ITEM_SK(item.id),
            },
          },
          ConditionExpression: "PK <> :PKVal AND #SK <>  :SKVal",
          ExpressionAttributeNames: {
            "#SK": "SK",
          },
          ExpressionAttributeValues: {
            ":PKVal": { S: subscription },
            ":SKVal": { S: ITEM_SK(item.id) },
          },
        },
        (err) => {
          if (err) {
            fail(err);
          }
          ok();
        }
      );
    });
  }
}

module.exports = {
  Dynamo,
};
