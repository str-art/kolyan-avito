const { parse } = require("node-html-parser");
const tr = require("tor-request");

const DEFAULT_MARKERS = {
  dataMarker: "data-marker",
  itemMarker: "item",
  titleAndUrlMarker: "data-marker",
  titleAndUrlValue: "item-title",
  priceMarker: "itemprop",
  priceValue: "price",
  descriptionMarker: "itemprop",
  descriptionValue: "description",
  idMarker: "data-item-id",
  descriptionAttribute: "content",
  titleAttribute: "title",
};

const checkIp = async (tr) =>
  new Promise((resolve, reject) => {
    console.log("check ip");
    const req = tr.request("https://api.ipify.org");
    req.on("error", (err) => {
      console.log(err);
      reject(err);
    });
    req.on("complete", (resp, body) => {
      console.log(body);
      resolve(body);
    });
  });

const search = async (url) => {
  // await checkIp(tr);
  await new Promise((ok, fail) => {
    tr.newTorSession((err) => {
      if (err) {
        fail();
      }
      ok();
    });
  });
  return new Promise((resolve, reject) => {
    const req = tr.request(url, {
      timeout: 5000,
    });
    req.on("error", (err) => {
      reject(err);
    });

    req.on("complete", (resp, body) => {
      if (resp.statusCode === 403) {
        reject("Blocked by avito");
      }
      resolve(parse(body));
    });
  });
};
const findItems = (
  rootHTMLElement,
  { dataMarker, itemMarker } = DEFAULT_MARKERS
) => {
  let items = [];
  let children = rootHTMLElement.childNodes;
  while (children.length > 0) {
    const node = children.pop();
    if (node.getAttribute) {
      const marker = node.getAttribute(dataMarker);
      if (marker === itemMarker) {
        items.push(node);
        continue;
      }
    }
    children.push(...node.childNodes);
  }

  return items;
};
const findNodeByAttribute = (attribute, value, root) => {
  let children = root.childNodes.slice();
  while (children.length > 0) {
    const node = children.pop();
    if (node.getAttribute) {
      const itemprop = node.getAttribute(attribute);
      if (itemprop === value) {
        return node;
      }
    }

    node.childNodes && children.push(...node.childNodes);
  }
  return null;
};
const getItemUrlAndTitle = (
  itemNode,
  { titleAndUrlMarker, titleAndUrlValue, titleAttribute } = DEFAULT_MARKERS
) => {
  let result = { url: null, title: null };

  const urlAndTitleNode = findNodeByAttribute(
    titleAndUrlMarker,
    titleAndUrlValue,
    itemNode
  );

  if (urlAndTitleNode) {
    result.url = `https://avito.ru${urlAndTitleNode.getAttribute("href")}`;
    result.title = urlAndTitleNode.getAttribute(titleAttribute);
  }

  return result;
};
const getItemPrice = (
  itemNode,
  { priceMarker, priceValue, descriptionAttribute } = DEFAULT_MARKERS
) => {
  let price = null;

  const priceNode = findNodeByAttribute(priceMarker, priceValue, itemNode);

  if (priceNode) {
    price = priceNode.getAttribute(descriptionAttribute);
  }

  return price;
};
const getItemDescription = (
  itemNode,
  {
    descriptionMarker,
    descriptionValue,
    descriptionAttribute,
  } = DEFAULT_MARKERS
) => {
  let description = "Не указано";

  const metaNode = findNodeByAttribute(
    descriptionMarker,
    descriptionValue,
    itemNode
  );

  if (metaNode) {
    description = metaNode.getAttribute(descriptionAttribute);
  }

  return description;
};
const parseItem = (itemNode, markers = DEFAULT_MARKERS) => {
  const { url, title } = getItemUrlAndTitle(itemNode, markers);
  const description = getItemDescription(itemNode, markers);
  const price = getItemPrice(itemNode, markers);
  const id = parseInt(itemNode.getAttribute(markers.idMarker));

  return { id, price, description, title, url };
};

module.exports = {
  search,
  parseItem,
  checkIp,
  findItems,
};
