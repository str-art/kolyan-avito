export default class QueryBuilder {
  constructor(database) {
    this.database = database;
  }

  async query(sql, binds) {
    const { sql: __sql, binds: __binds } = this.__processBinds(sql, binds);
    return this.database.query(__sql, __binds);
  }

  __processBinds(sql, binds) {
    let bindsArray = [];

    const entries = Object.entries(binds);

    let i = 1;

    for (i; i <= entries.length; i++) {
      const index = i - 1;

      const [column, value] = entries[index];

      const bindsName = `:${column}`;

      if (Array.isArray(value)) {
        sql = sql.replaceAll(bindsName, `($${i})`);
        bindsArray.push(value);
        continue;
      }

      if (typeof binds[column] === "object") {
        throw Error("Invalid binds. Cant bind object fields");
      }

      bindsArray.push(value);

      sql = sql.replaceAll(bindsName, `$${i}`);
    }

    return { sql, binds: bindsArray };
  }

  __buildWhereClause(selector = {}, alias = "") {
    const keys = Object.keys(selector);

    let conditions = [];

    for (const key of keys) {
      conditions.push(` ${alias ? alias + "." : ""}"${key}" = :${key}`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    return whereClause;
  }

  __buildOrderClause(order, alias = "") {
    const entries = Object.entries(order);

    let orders = [];

    for (const [column, order = "ASC"] of entries) {
      let __order;

      switch (order) {
        case true:
        case "ASC": {
          __order = "ASC";
          break;
        }
        case false:
        case "DESC": {
          __order = "DESC";
          break;
        }
        default: {
          __order = "ASC";
        }
      }

      orders.push(` ${alias ? alias + "." : ""}"${column}" ${__order} `);
    }

    const orderClause = `ORDER BY ${orders.join(" , ")}`;

    return orderClause;
  }
}
