import QueryBuilder from "./Query-Builder.js";

export default class Selectable extends QueryBuilder {
  constructor(database) {
    super(database);
    this.limit = 10;
  }

  async paginate(sql, binds = {}, __page = 1, __offset = this.limit) {
    const paginatedList = await this.query(
      `
        WITH data AS(
            ${sql}
        ),
        rows AS (
            SELECT
                COUNT(*) "rows"
            FROM
                data
        ),
        pages AS (
            SELECT
                CEIL(
                  CAST(R."rows" AS DECIMAL(7,2)) / CAST(:__offset AS DECIMAL(7,2))) "pages"
            FROM
                rows R
        )
        SELECT
                D.*,
                P.*
        FROM data D, pages P
        LIMIT :__offset
        OFFSET (:__page - 1) * :__offset  
        `,
      { ...binds, __page, __offset }
    );

    const result = paginatedList.reduce(
      (list, row) => {
        const { pages, ...rest } = row;
        list.rows.push(rest);
        list.total = pages;
        return list;
      },
      { page: __page, rows: [], total: 0 }
    );
    return result;
  }

  async select(selector = {}) {
    const isSelectorEmpty = Object.keys(selector).length === 0;
    const sql = `
    SELECT
        *
    FROM
        "${this.name}"
    ${isSelectorEmpty ? "" : this.__buildWhereClause(selector)}
    `;

    let result = await this.query(sql, selector);
    if (result.length === 1) {
      result = result[0];
    }

    if (result.length === 0) {
      result = null;
    }
    return result;
  }
}
