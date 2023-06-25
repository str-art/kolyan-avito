const { search, parseItem, findItems } = require("./avito");
const { Telegram } = require("./Telegram");
const { Dynamo } = require("./dynamo");

exports.handler = async (event, context) => {
  try {
    const { payload } = event;

    const { url, table_name, chat_id, token } = payload;

    const telegram = new Telegram({ chat_id, token });

    const dynamo = new Dynamo(table_name);

    const htmlNode = await search(url);

    const items = findItems(htmlNode);

    const itemAttibutes = items.map((item) => parseItem(item));

    await Promise.allSettled(
      itemAttibutes.map(async (item) => {
        try {
          await dynamo.addItem(item, url);
          await telegram.__sendMessage(item);
        } catch (error) {
          console.log(error);
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
