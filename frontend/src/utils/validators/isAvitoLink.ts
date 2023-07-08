import isURL from "validator/lib/isURL";

export const isAvitoLink = (link: string) =>
  isURL(link, {
    host_whitelist: ["avito.ru", "www.avito.ru"],
    require_host: true,
  });

export const isHttpsLink = (link: string) =>
  isURL(link, {
    protocols: ["https"],
    require_protocol: true,
  });
