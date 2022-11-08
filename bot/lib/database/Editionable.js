import Selectable from "./Selectable.js";

export default class Editionable extends Selectable {
  constructor(database, name, scheme) {
    super(database);
    this.name = name;
    this.scheme = scheme;
  }

  async insert(scheme = {}) {
    if (typeof scheme !== "object" || Object.keys(scheme).length === 0) {
      throw Error(`Cannot insert into ${this.name}. Data is invalid `);
    }

    const keys = Object.keys(scheme);
    const values = Object.values(scheme);

    const query = `
        INSERT INTO "${this.name}" (${this.__addKeys(
      keys
    )}) VALUES(${this.__addBinds(keys)}) RETURNING ${this.__addKeys(
      Object.keys(this.scheme)
    )}
        `;
    const result = await this.database.query(query, values);
    return result[0];
  }

  async update(selector = {}, updates = {}) {
    const sql = `
    UPDATE "${this.name}"
    ${this.__buildSetClause(updates)}
    ${this.__buildWhereClause(selector)}
    RETURNING ${this.__addKeys(Object.keys(this.scheme))}
    `;

    const result = await this.query(sql, { ...selector, ...updates });
    return result.length === 1 ? result[0] : result;
  }

  async delete(selector = {}) {
    const sql = `
    DELETE FROM "${this.name}"
    ${this.__buildWhereClause(selector)}
    `;

    await this.query(sql, selector);
  }

  __addBinds(keys) {
    let binds = "";
    for (let i = 1; i <= keys.length; i++) {
      binds = binds.concat(`$${i},`);
    }
    binds = binds.replace(new RegExp(/,$/), "");

    return binds;
  }

  __addKeys(keys) {
    let aliases = "";
    for (const field of keys) {
      aliases = aliases.concat(`"${field}",`);
    }

    aliases = aliases.replace(new RegExp(/,$/), "");
    return aliases;
  }

  __buildSetClause(updates, alias = "") {
    let setClause = "SET ";

    const entries = Object.entries(updates);

    for (const [column, value] of entries) {
      setClause = setClause.concat(
        `${alias ? alias + "." : ""}"${column}" = :${column}Value ,`
      );
      updates[`${column}Value`] = value;
      delete updates[column];
    }

    setClause = setClause.replace(new RegExp(/,$/), "");

    return setClause;
  }
}
