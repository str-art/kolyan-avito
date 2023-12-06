import dayjs from 'dayjs';

export const getValidTimestamp = (): Timestamp => dayjs().add(2, 'days').unix();

export const sleepFor = async (amountMs = 10) =>
  new Promise<void>(ok => {
    setTimeout(() => ok(), amountMs);
  });

export const skipLoopTick = async () => sleepFor(0);
