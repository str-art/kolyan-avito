import { Avito } from "./Avito.js";
import Database from "./database/Database.js";
import DirLoader from "./database/DirLoader.js";
import { Telegram } from "./Telegram.js";
import path from "path";
import tr from "tor-request";

export class App {
  url;
  interval;
  constructor(url, interval = 1, databaseConfig, telegramConfig) {
    (this.url = url), (this.interval = interval);
    this.AvitoService = new Avito();
    this.Telegram = new Telegram(telegramConfig);
    this.database = new Database(databaseConfig);
    this.dirLoader = new DirLoader();
  }

  async loopTick() {
    console.log("New main loop tick");
    try {
      await new Promise((resolve, reject) => {
        tr.newTorSession((err) => {
          if (err) {
            console.error("newTorSessionError", err);
            reject(err);
          }
          resolve();
        });
      });
      console.log("Avito search");
      const searchResult = await this.AvitoService.search(this.url);
      console.log("Avito search done");
      const newItems = this.AvitoService.getItemsFromSearch(searchResult);
      console.log("Parsed search result");
      for (const item of newItems) {
        try {
          const parsedItem = this.AvitoService.AvitoItem.parseItem(item);
          await this.entities.SearchItem.insert({
            id: parsedItem.id,
            url: parsedItem.url,
          });
          this.Telegram.sendItem(parsedItem);
        } catch (error) {
          if (!error.message.includes("SearchItem_pkey")) {
            console.error(error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log("setting next loop tick");
      setTimeout(() => this.loopTick(), this.interval * 1000 * 60);
    }
  }

  async bootstrap() {
    console.log("start");
    await this.database.connect();
    console.log("connected to db");
    await this.loadEntities();
    console.log("loaded entities");
    await this.loopTick();
  }

  async loadEntities() {
    this.entities = {};
    const entitiesPath = path.join(
      process.env.DIR_ROOT,
      "lib",
      "database",
      "entities"
    );
    const entities = await this.dirLoader.loadDir(entitiesPath);
    for (const E of entities) {
      const entity = new E(this.database);
      this.entities[entity.name] = entity;
      try {
        await entity.create();
      } catch (error) {}
    }
  }
}
