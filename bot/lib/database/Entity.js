import Editionable from "./Editionable.js";

export default class Entity extends Editionable {
  constructor(database, name, scheme) {
    super(database, name, scheme);
  }

  async create() {
    const query = `
        CREATE TABLE "${this.name}" (
            ${this.__buildTableSchema()},
            Primary key(${this.__getPrimaryKey()})
        )
        `;
    try {
      await this.database.query(query);
    } catch (error) {
      console.log("Failed to create entity");
    }
  }

  build(fields = {}) {
    let entiity = {};
    for (const column in this.scheme) {
      if (fields[column] !== undefined) {
        entiity[column] = fields[column];
      }
    }
    return entiity;
  }

  __buildTableSchema() {
    let tableSchema = "";
    for (const column in this.scheme) {
      const type = this.scheme[column].type;

      const unique = this.scheme[column].unique;

      const nullable = !this.scheme[column].nullable;

      const _default = !(this.scheme[column].default === undefined);

      const defualtValue = this.scheme[column].default;

      const foreignKey = !(this.scheme[column].foreignKey === undefined);

      let fkTable = null;

      let fkColumn = null;

      if (foreignKey) {
        fkTable = `"${this.scheme[column].foreignKey.table}"`;
        fkColumn = `("${this.scheme[column].foreignKey.column}")`;
      }

      tableSchema = tableSchema.concat(
        `${column} ${type} 
        ${unique ? "UNIQUE" : ""} 
        ${nullable ? "" : "NOT NULL"} 
        ${_default ? "DEFAULT " + defualtValue : ""} 
        ${foreignKey ? "REFERENCES " + fkTable + " " + fkColumn : ""},`
      );
    }

    tableSchema = tableSchema.replace(new RegExp(/,$/), "");
    return tableSchema;
  }

  __getPrimaryKey() {
    for (const column in this.scheme) {
      if (this.scheme[column].isPK) {
        return column;
      }
    }

    throw Error(`No primary key specified for table ${this.name} `);
  }
}
