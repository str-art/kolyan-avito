import {createLogger as bunyan, stdSerializers} from 'bunyan';

export const createLogger = (name: string) =>
  bunyan({name, serializers: stdSerializers, level: 'trace'});
export const logger = createLogger('Category parser');
