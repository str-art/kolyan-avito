import { Schedule } from '@modules/scheduler/models/schedule.model';
import { REQUEST_CONTEXT } from '@tokens';

export {};

declare global {
  type ENV = 'development' | 'production' | 'testing';

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: ENV;
      LOCALSTACK_ENDPOINT?: string;
      REGION: string;
    }
  }

  namespace Aws {
    interface IBaseConfig {
      region?: string;
      endpoint?: string;
    }
  }

  namespace Express {
    interface Request {
      userId: string;
      chatId: string;
      schedules: Schedule[];
      user: User;
    }
  }

  interface User {
    id: string;
    chatId: string;
  }

  interface SchedulePayload {
    url: string;
    chat_id: string;
    table_name: string;
    token: string;
  }

  export interface RequestContext {
    user: User;
    schedules: Schedule[];
  }

  export interface ExtendedValidationArguments extends ValidationArguments {
    object: {
      [REQUEST_CONTEXT]?: RequestContext;
    };
  }
}
