import http from "https";
import { parse } from "node-html-parser";

export default async function getLastSearch() {
  const avitoHtml = await new Promise((resolve, reject) => {
    http.get(
      "https://www.avito.ru/all/muzykalnye_instrumenty/gitary_i_strunnye-ASgBAgICAUTEAsYK?cd=1&s=104",
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(parse(data));
        });

        res.on("error", (err) => reject(err));
      }
    );
  });

  let node = avitoHtml;

  let children = avitoHtml.childNodes;

  let items = [];

  while (children.length > 0) {
    if (node.getAttribute) {
      const marker = node.getAttribute("data-marker");
      if (marker === "item") {
        items.push(node);
        node = children.pop();
        continue;
      }
    }
    node = children.pop();
    children.push(...node.childNodes);
  }
  return items;
}
