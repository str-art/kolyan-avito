const { search, parseItem, findItems } = require("./avito");
const { Dynamo } = require("./dynamo");
const { ConditionalCheckFailedException } = require("@aws-sdk/client-dynamodb");

exports.handler = async (event, context) => {
  try {
    const { payload } = event;

    const { url, table_name, chat_id, token } = payload;

    const dynamo = new Dynamo(table_name);

    const htmlNode = await search(url);

    const items = findItems(htmlNode);

    const itemAttibutes = items.map((item) => ({
      ...parseItem(item),
      chat_id,
      token,
    }));

    await Promise.allSettled(
      itemAttibutes.map(async (item) => {
        try {
          await dynamo.addItem(item, url);
        } catch (error) {
          if (!(error instanceof ConditionalCheckFailedException)) {
            console.error(error);
          }
        }
      })
    );

    return {
      code: 200,
      itemAttibutes,
    };
  } catch (error) {
    return {
      code: 500,
      message: error.message,
    };
  }
};
