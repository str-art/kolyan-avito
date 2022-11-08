import { Avito } from "./Avito.js";
import Database from "./database/Database.js";
import DirLoader from "./database/DirLoader.js";
import { Telegram } from "./Telegram.js";
import path from "path";

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
    try {
      const searchResult = await this.AvitoService.search(this.url);
      const newItems = this.AvitoService.getItemsFromSearch(searchResult);
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
      setTimeout(() => this.loopTick(), this.interval * 1000);
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
    const entitiesPath = path.join(process.env.DIR_ROOT, "entities");
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
