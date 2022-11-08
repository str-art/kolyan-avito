import http from "https";
import { parse } from "node-html-parser";
import { AvitoItem } from "./AvitoItem.js";

export class Avito {
  constructor() {
    this.AvitoItem = new AvitoItem();
  }
  async search(url) {
    return new Promise((resolve, reject) => {
      http.get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          console.log(data);
          resolve(parse(data));
        });

        res.on("error", (err) => reject(err));
      });
    });
  }

  getItemsFromSearch(rootHTMLElement) {
    let items = [];
    let children = rootHTMLElement.childNodes;
    while (children.length > 0) {
      const node = children.pop();
      if (node.getAttribute) {
        const marker = node.getAttribute("data-marker");
        if (marker === "item") {
          items.push(node);
          continue;
        }
      }
      children.push(...node.childNodes);
    }

    return items;
  }
}
