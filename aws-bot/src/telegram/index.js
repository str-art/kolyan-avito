const { Telegram } = require("./telegram.js");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const tg = new Telegram();

exports.handler = async (event, context) => {
  try {
    const { Records } = event;
    const { dynamodb } = Records[0];
    const item = unmarshall(dynamodb.NewImage);
    await tg.sendMessage(item);
    return {
      code: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      code: 500,
    };
  }
};
