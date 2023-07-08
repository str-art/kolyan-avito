import axios from "axios";
import { createContext, useContext } from "react";
import { useTelegramContext } from "./TelegramProvider";

const baseURL = process.env.REACT_APP_BASE_URL || "/api";

const ClientContext = createContext(axios.create());

export const useClientContext = () => useContext(ClientContext);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useTelegramContext();

  const restClient = axios.create({
    headers: {
      Authorization: `Bearer ${user.userId}::${user.chatId}`,
    },
    baseURL,
  });

  return (
    <ClientContext.Provider value={restClient}>
      {children}
    </ClientContext.Provider>
  );
};
