import EventEmitter from "node:events";
import pg from "pg";

const { Pool } = pg;

export default class Database extends EventEmitter {
  config = {
    host: null,
    port: null,
    user: null,
    password: null,
    database: null,
  };
  pool;

  constructor(config) {
    super();

    this.setConfig(config);
  }

  setConfig(config) {
    for (const field in this.config) {
      if (!config[field]) {
        throw Error(`Database ${field} is not defiend`);
      }

      this.config[field] = config[field];
    }
    Object.freeze(this.config);
  }

  async connect() {
    this.pool = new Pool(this.config);
    await this.__startUUIDSequence();
    return this;
  }

  async query(...args) {
    const client = await this.pool.connect();
    try {
      const { rows } = await new Promise((resolve, reject) => {
        client.query(...args, (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(res);
        });
      });
      client.release();

      return rows;
    } catch (error) {
      client.release();
      throw error;
    }
  }

  async __startUUIDSequence() {
    try {
      await this.query(
        `
        CREATE SEQUENCE IF NOT EXISTS UUID START 1
        `
      );
    } catch (err) {
      throw Error(`Failed to start uuid sequence: ${err.message}`);
    }
  }

  async getNextUUID() {
    const [{ nextval }] = await this.query(
      `
      SELECT nextval('UUID')
      `
    );
    return nextval;
  }
}
