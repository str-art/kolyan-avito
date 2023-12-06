export const stripLinkFromQuery = (link: string) => {
  const url = new URL(link);
  return `${url.protocol}//${url.hostname}${url.pathname}`;
};
