import { App } from "./lib/App.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

process.env.DIR_ROOT = path.dirname(__filename);

const telegramConfig = {
  chat_id: process.env.CHAT_ID,
  token: process.env.TOKEN,
};

const databaseConfig = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
};

const AvitoBot = new App(
  process.env.URL,
  parseInt(process.env.INTERVAL),
  databaseConfig,
  telegramConfig
);

(async () => {
  await AvitoBot.bootstrap();
})();
