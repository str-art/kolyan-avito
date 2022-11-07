const parseItemHtml = (item) => {
  const [meta, body] = item.childNodes;

  const content = parseMeta(meta);
  const { price, imgs, title, url, updated } = parseBody(body);

  const id = item.getAttribute("id");

  return {
    content,
    price,
    imgs,
    id,
    title,
    url,
    updated,
  };
};

const parseMeta = (metaHtml) => {
  if (!metaHtml.getAttribute) {
    return "Нет описания";
  }
  return metaHtml.getAttribute("content");
};

const parseBody = (body) => {
  const [slider, info] = body.childNodes;

  const imgs = slider
    .getElementsByTagName("img")
    .map((i) => i.getAttribute("src"));

  const price = (() => {
    let children = info.childNodes.slice();
    while (children.length > 0) {
      const node = children.pop();
      if (node.getAttribute) {
        const itemprop = node.getAttribute("itemprop");
        if (itemprop === "price") {
          return node.getAttribute("content");
        }
      }

      children.push(...node.childNodes);
    }

    return "Не известно";
  })();

  const { title = "Не известно", url = "Не найдено" } = (() => {
    let children = info.childNodes.slice();
    while (children.length > 0) {
      const node = children.pop();
      if (node.getAttribute) {
        const itemprop = node.getAttribute("data-marker");
        if (itemprop === "item-title") {
          const url = `https://avito.ru${node.getAttribute("href")}`;
          const title = node.getAttribute("title");
          return { url, title };
        }
      }

      children.push(...node.childNodes);
    }
    return {};
  })();

  const updated = (() => {
    let children = info.childNodes.slice();

    while (children.length > 0) {
      const node = children.pop();

      if (node.getAttribute) {
        const itemprop = node.getAttribute("data-marker");

        if (itemprop === "item-date") {
          const [num, unit] = node.text.split(" ");
          switch (true) {
            case unit.indexOf("мин") === 0: {
              return parseInt(num);
            }
            case unit.indexOf("час") === 0: {
              return parseInt(num) * 60;
            }
            case unit.indexOf("дня") === 0: {
              return parseInt(num) * 60 * 24;
            }
          }
          return Infinity;
        }
      }

      children.push(...node.childNodes);
    }
  })();

  return { price, imgs, title, url, updated };
};

export const parseItems = (items) =>
  items.map((i) => parseItemHtml(i)).sort((a, b) => a.updated - b.updated);
