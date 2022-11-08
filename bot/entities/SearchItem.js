import Entity from "../lib/database/Entity.js";

export default class SearchItem extends Entity {
  constructor(database) {
    const name = "SearchItem";
    const scheme = {
      id: { type: "bigint", isPK: true, default: `nextval('UUID')` },
      url: { type: "varchar(256)", nullable: false },
      description: { type: "varchar(512)", nullable: false },
      price: { type: "varchar(64)", nullable: false },
      title: { type: "varchar(128)", nullable: false },
    };

    super(database, name, scheme);
  }
}
