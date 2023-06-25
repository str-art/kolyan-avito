import Entity from "../Entity.js";

export default class SearchItem extends Entity {
  constructor(database) {
    const name = "SearchItem";
    const scheme = {
      id: { type: "bigint", isPK: true, default: `nextval('UUID')` },
      url: { type: "varchar(256)", nullable: false },
    };

    super(database, name, scheme);
  }
}
