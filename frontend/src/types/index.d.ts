import { TelegramWebApps as Original } from "telegram-webapps-types";

declare global {
  namespace TelegramWebApps {
    enum ChatType {
      GROUP = "group",
      SUPERGROUP = "supergroup",
      CHANNEL = "channel",
      PRIVATE = "private",
      SENDER = "sender",
    }

    interface WebAppChat {
      id: number;
      type: ChatType;
      title: string;
      username?: string;
    }

    export interface WebAppInitData {
      chat?: WebAppChat;
      chat_type?: ChatType;
      chat_instance?: string;
    }
  }

  interface Window {
    Telegram: Original.SDK & {
      WebApp: { initDataUnsafe: TelegramWebApps.WebAppInitData };
    };
  }

  namespace Api {
    interface Schedule {
      name: string;
      enabled: boolean;
      url: string;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_USER_ID: string;
      REACT_APP_CHAT_ID: string;
    }
  }
}
