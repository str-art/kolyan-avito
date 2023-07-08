import { createContext, useContext } from "react";
import { Loader } from "../components/Loader";

type TelegramContextType = {
  userId: string;
  chatId: string;
};

export const TelegramContext = createContext<TelegramContextType>(
  {} as TelegramContextType
);

enum TelegramStatus {
  OK,
  NOT_OK,
}

const validateTelegram = ():
  | { status: TelegramStatus.NOT_OK }
  | { status: TelegramStatus.OK; user: TelegramContextType } => {
  if (process.env.NODE_ENV === "development") {
    return {
      status: TelegramStatus.OK,
      user: {
        userId: process.env.REACT_APP_USER_ID,
        chatId: process.env.REACT_APP_CHAT_ID,
      },
    };
  }

  if (!window.Telegram) {
    return { status: TelegramStatus.NOT_OK };
  }

  if (!window.Telegram.WebApp.initDataUnsafe) {
    return { status: TelegramStatus.NOT_OK };
  }

  const user = {
    userId: window.Telegram.WebApp.initDataUnsafe.user?.id?.toString(),
    chatId: window.Telegram.WebApp.initDataUnsafe.user?.id?.toString(),
  };

  if (window.Telegram.WebApp.initDataUnsafe.chat_type === "channel") {
    user.chatId =
      window.Telegram.WebApp.initDataUnsafe.chat_instance || user.chatId;
  }

  if (!user.chatId || !user.userId) {
    return { status: TelegramStatus.NOT_OK };
  }
  // @ts-expect-error
  return { status: TelegramStatus.OK, user };
};

export const useTelegramContext = () => useContext(TelegramContext);

export const TelegramProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const validation = validateTelegram();
  if (validation.status === TelegramStatus.NOT_OK) {
    return <Loader />;
  }

  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();

  return (
    <TelegramContext.Provider value={validation.user}>
      {children}
    </TelegramContext.Provider>
  );
};
