import axios from "axios";

const token = "bot5488546599:AAGgQsI_8JNTzHhR-HdGj-m5iLahAXqKp88";

const chat_id = "-1001500732698";

export const sendToTg = async ({ price, title, url, content, imgs }) => {
  let text = `<b>${title}</b>
<b>Цена: ${price}</b>
<a href="${url}"> Ссылка </a>
${content}
`;

  try {
    await axios.post(`https:/api.telegram.org/${token}/sendMessage`, {
      chat_id,
      text,
      parse_mode: "HTML",
    });
  } catch ({ response }) {
    const { data } = response;
    if (data.error_code === 429) {
      setTimeout(() => sendToTg({ price, title, url, content }), 10);
    }
    console.error(data);
  }
};
