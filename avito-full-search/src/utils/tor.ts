import tor from 'tor-request';
import {createLogger} from '@utils/logger';
import {EventEmitter} from 'events';
import {backOff} from 'exponential-backoff';
import {ECONNRESET, ESOCKETTIMEOUT, TorEvent} from '@constants/tor';
import {skipLoopTick} from '@utils/common';
import {getRequestsAmountLimit} from './config';

const TOO_MANY_REQUESTS = 429;
const FORBIDDEN = 403;
const SERVER_ERROR = 503;

enum TorSessionStatus {
  UPDATING,
  STABLE,
}

const CODES_TO_RETRY = [
  TOO_MANY_REQUESTS,
  FORBIDDEN,
  SERVER_ERROR,
  ECONNRESET,
  ESOCKETTIMEOUT,
];

const CODES_TO_UPDATE_SESSION = [TOO_MANY_REQUESTS, FORBIDDEN];

const logger = createLogger('Tor');

const emitter = new EventEmitter({});

emitter.setMaxListeners(3000);

let requestsInProgress = 0;

let sessionStatus = TorSessionStatus.STABLE;

const emitAmountChange = () => {
  emitter.emit(TorEvent.REQUEST_AMOUN_CHANGED, requestsInProgress);
  logger.trace('Pending requests: %d', requestsInProgress);
};

emitter.on(TorEvent.REQUEST_STARTED, () => {
  requestsInProgress += 1;
  emitAmountChange();
});

emitter.on(TorEvent.REQUEST_FINISHED, () => {
  if (requestsInProgress > 0) {
    requestsInProgress -= 1;
  }
  if (requestsInProgress === 0) {
    emitter.emit(TorEvent.ALL_REQUESTS_FINISHED);
  }
  emitAmountChange();
});

const waitFor = () => ({
  requestAmountToBe: async (amount: number) =>
    new Promise<void>(ok => {
      const react = async () => {
        await skipLoopTick();
        if (requestsInProgress <= amount) {
          ok();
          return;
        }
        emitter.once(TorEvent.REQUEST_AMOUN_CHANGED, react);
      };
      react();
    }),
  requestCanStart: async (): Promise<void> => {
    if (sessionStatus !== TorSessionStatus.STABLE) {
      await waitFor().torSessionUpdate();
      return waitFor().requestCanStart();
    }
    await waitFor().requestAmountToBe(getRequestsAmountLimit());
    if (sessionStatus === TorSessionStatus.STABLE) {
      return;
    }
    return waitFor().requestCanStart();
  },
  allRequestsToFinish: async () => waitFor().requestAmountToBe(0),
  torSessionUpdate: async () =>
    new Promise<void>((ok, fail) => {
      emitter.once(TorEvent.SESSION_UPDATE_FINISHED, err => {
        if (err) {
          fail(err);
        }
        ok();
      });
    }),
});

const markRequestStart = () => {
  emitter.emit(TorEvent.REQUEST_STARTED);
};

const markRequestFinish = () => {
  emitter.emit(TorEvent.REQUEST_FINISHED);
};

const requestTorSessionUpdate = () =>
  new Promise<void>((ok, fail) => {
    logger.info('Updating tor session.');
    tor.newTorSession(err => {
      logger.info('Tor session updated.');
      if (err) {
        fail(err);
      }
      ok();
    });
  });

const updateTorSession = async () => {
  logger.trace('Starting session update');

  if (sessionStatus === TorSessionStatus.UPDATING) {
    return waitFor().torSessionUpdate();
  }

  sessionStatus = TorSessionStatus.UPDATING;

  await waitFor().allRequestsToFinish();

  try {
    await requestTorSessionUpdate();
    emitter.emit(TorEvent.SESSION_UPDATE_FINISHED);
    sessionStatus = TorSessionStatus.STABLE;
  } catch (error) {
    emitter.emit(TorEvent.SESSION_UPDATE_FINISHED, error);
  } finally {
    logger.trace('Session update finished');
  }
};

const controlledRequest = async (link: string) => {
  await waitFor().requestCanStart();
  return new Promise<string>((ok, fail) => {
    markRequestStart();
    tor.request(link, {timeout: 10000}, (err, resp, body) => {
      markRequestFinish();
      if (resp?.statusCode >= 400) {
        return fail({
          code: resp.statusCode,
          message: resp.statusMessage,
        });
      }
      if (err) {
        return fail(err);
      }

      ok(body);
    });
  });
};

export const request = async (link: string) =>
  backOff(
    async () => {
      const resp = await controlledRequest(link);
      return resp;
    },
    {
      retry: async (err, attempt) => {
        if (!('code' in err)) {
          return false;
        }
        logger.trace('Request failed. Retrying. Attempt %d', attempt);
        if (CODES_TO_UPDATE_SESSION.includes(err.code)) {
          await updateTorSession();
        }
        return CODES_TO_RETRY.includes(err.code);
      },
      delayFirstAttempt: true,
      jitter: 'full',
    }
  );
