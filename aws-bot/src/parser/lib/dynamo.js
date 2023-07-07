const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const DELIMITER = "@";
const ITEM_SK = (item) => `${item.user_id}${DELIMITER}${item.id}`;

class Dynamo {
  constructor(table_name) {
    this.table_name = table_name;
    this.client = new DynamoDB({
      region: "eu-central-1",
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
            chat_id: {
              S: item.chat_id,
            },
            title: {
              S: item.title,
            },
            PK: {
              S: subscription,
            },
            SK: {
              S: ITEM_SK(item),
            },
          },
          ConditionExpression: "PK <> :PKVal AND #SK <>  :SKVal",
          ExpressionAttributeNames: {
            "#SK": "SK",
          },
          ExpressionAttributeValues: {
            ":PKVal": { S: subscription },
            ":SKVal": { S: ITEM_SK(item) },
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
