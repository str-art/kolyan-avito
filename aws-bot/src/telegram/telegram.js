const axios = require("axios");

class Telegram {
  constructor() {
    this.host = "https:/api.telegram.org/";
  }

  async sendMessage(item) {
    const text = this.formatText(item);
    const token = process.env.TOKEN;
    await this.request(token, "post", "sendMessage", {
      chat_id: item.chat_id,
      text,
      parse_mode: "HTML",
    });
  }

  async request(token, method, action, body = {}, params = {}) {
    return axios({
      method: method.toLowerCase(),
      baseURL: this.host,
      url: `bot${token}/${action}`,
      data: body,
      params,
    });
  }

  formatText({ price, title, url, description }) {
    return `<b>${title}</b>
        <b>Цена: ${price}</b>
        <a href="${url}"> Ссылка </a>
        ${description}
        `;
  }
}

module.exports = {
  Telegram,
};
