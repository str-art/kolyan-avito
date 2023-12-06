import {ROOT_URL} from '@constants/avito';
import {Category} from '@models/Category';
import {avitoRequest, extractRootCategories, parseCategory} from '@utils/avito';
import {logger} from '@utils/logger';

function makeHeartbeat() {
  let interval: NodeJS.Timer | null;
  const label = 'Heartbeat';
  return {
    start: () => {
      interval = setInterval(() => {
        logger.trace('heartbeat');
      }, 10000);
      console.time(label);
    },
    stop: () => {
      if (!interval) {
        return;
      }
      clearInterval(interval);
      interval = null;
      console.timeEnd(label);
    },
  };
}

async function lambda() {
  const heartbeat = makeHeartbeat();
  heartbeat.start();
  const allCategories: Array<Category> = [];
  try {
    const avito = await avitoRequest(ROOT_URL);
    const categoryNodes = extractRootCategories(avito);
    await Promise.all(
      categoryNodes.map(category => parseCategory(category.link, allCategories))
    );
    await Promise.all(allCategories.map(category => category.save()));
  } catch (error) {
    logger.error(error);
  }

  heartbeat.stop();
}

lambda();
