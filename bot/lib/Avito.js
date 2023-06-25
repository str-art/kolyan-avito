import tr from "tor-request";
import { parse } from "node-html-parser";
import { AvitoItem } from "./AvitoItem.js";

export class Avito {
  constructor() {
    this.AvitoItem = new AvitoItem();
  }
  async search(url) {
    await new Promise((resolve) => {
      tr.request("https://api.ipify.org", { timeout: 5000 }).on(
        "complete",
        (resp, body) => {
          console.log(body);
          resolve();
        }
      );
    });
    return new Promise((resolve, reject) => {
      const req = tr.request({ url, timeout: 5000 });

      let data = "";

      req.on("data", (chunk) => {
        data += chunk;
      });

      req.on("complete", () => {
        console.log("recieved answer from avito");
        resolve(parse(data));
      });

      req.on("error", (err) => {
        console.log("avito error");
        reject(err);
      });
    });
    // return new Promise((resolve, reject) => {
    //   http.get(url, (res) => {
    //     let data = "";
    //     res.on("data", (chunk) => {
    //       data += chunk;
    //     });

    //     res.on("end", () => {
    //       resolve(parse(data));
    //     });

    //     res.on("error", (err) => reject(err));
    //   });
    // });
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
