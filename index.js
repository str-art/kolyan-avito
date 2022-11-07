import getLastSearch from "./getLastSearch.js";
import { parseItems } from "./parseItemHtml.js";
import { sendToTg } from "./tg.js";

const getItems = async () => {
  try {
    const raw = await getLastSearch();
    return parseItems(raw);
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  let cache = await getItems();
  setInterval(
    () =>
      getItems().then((items) => {
        console.log("update");
        if (items[0].id !== cache[0].id) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].id === cache[0].id) {
              break;
            }
            sendToTg(items[i]);
          }

          cache = items;
        }
      }),
    1000 * 60
  );
})();
