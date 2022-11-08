export class AvitoItem {
  constructor() {
    this.idMarker = "data-item-id";
    this.titleAndUrlMarker = "data-marker";
    this.titleAndUrlValue = "item-title";
    this.priceMarker = "itemprop";
    this.priceValue = "price";
    this.descriptionMarker = "itemprop";
    this.descriptionValue = "description";
  }

  parseItem(itemNode) {
    const { url, title } = this.__getItemUrlAndTitle(itemNode);
    const description = this.__getItemDescription(itemNode);
    const price = this.__getItemPrice(itemNode);
    const id = parseInt(itemNode.getAttribute(this.idMarker));

    return { id, price, description, title, url };
  }

  __getItemUrlAndTitle(itemNode) {
    let result = { url: null, title: null };

    const urlAndTitleNode = this.__findNodeByAttribute(
      this.titleAndUrlMarker,
      this.titleAndUrlValue,
      itemNode
    );

    if (urlAndTitleNode) {
      result.url = `https://avito.ru${urlAndTitleNode.getAttribute("href")}`;
      result.title = urlAndTitleNode.getAttribute("title");
    }

    return result;
  }

  __getItemPrice(itemNode) {
    let price = null;

    const priceNode = this.__findNodeByAttribute(
      this.priceMarker,
      this.priceValue,
      itemNode
    );

    if (priceNode) {
      price = priceNode.getAttribute("content");
    }

    return price;
  }

  __getItemDescription(itemNode) {
    let description = "Не указано";

    const metaNode = this.__findNodeByAttribute(
      this.descriptionMarker,
      this.descriptionValue,
      itemNode
    );

    if (metaNode) {
      description = metaNode.getAttribute("content");
    }

    return description;
  }

  __findNodeByAttribute(attribute, value, root) {
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
  }
}
