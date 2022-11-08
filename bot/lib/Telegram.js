import axios from "axios";
import PriorityQueue from "./PriorityQueue.js";

export class Telegram {
  constructor({ chat_id, token }) {
    (this.chat_id = chat_id), (this.token = token);
    this.queue = new PriorityQueue();
    this.startPriority = 1;
    this.host = "https:/api.telegram.org/";
    this.tickTime = 500;
    this.__intervalTick();
  }

  async __intervalTick() {
    const nextTask = this.queue.next();
    if (nextTask === null) {
      setTimeout(() => this.__intervalTick(), this.tickTime);
      return;
    }

    const { priority, value } = nextTask;

    let nextTickTime = this.tickTime;

    try {
      await this.__sendMessage(value);
    } catch (error) {
      if (error.response?.data.error_code === 429) {
        nextTickTime += error.response.data.parameters.retry_after;
        this.queue.insert({ priority, value });
      } else {
        console.error(error);
      }
    } finally {
      console.log("queue length:", this.queue.indexes.length);
      setTimeout(() => this.__intervalTick(), nextTickTime);
    }
  }

  sendItem(item) {
    this.queue.insert({ priority: this.startPriority, value: item });
    this.startPriority++;
  }

  async __sendMessage(item) {
    const text = this.formatText(item);
    await this.request("post", "sendMessage", {
      chat_id: this.chat_id,
      text,
      parse_mode: "HTML",
    });
  }

  async request(method, action, body = {}, params = {}) {
    return axios({
      method: method.toLowerCase(),
      baseURL: this.host,
      url: `${this.token}/${action}`,
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
