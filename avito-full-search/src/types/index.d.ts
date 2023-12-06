import {Stage} from '@constants/common';
import {HTMLElement} from 'node-html-parser';

declare global {
  type Noop = () => void;
  type AsyncNoop = <Params extends Array<unknown> = []>(
    ...params: Params
  ) => Promise<void>;

  type Timestamp = number;

  type HTMLResponse = string;

  type MergeTuples<
    BaseTuple extends unknown[],
    AddendTuple extends unknown[]
  > = [...BaseTuple, ...AddendTuple];

  type MergeFunctionParameters<
    Func extends (...params: unknown[]) => unknown,
    Params extends Array<unknown>
  > = (...params: MergeTuples<Parameters<Func>, Params>) => ReturnType<Func>;

  namespace Avito {
    type ParserResponse = {
      node: HTMLElement;
      raw: HTMLResponse;
    };

    type Category = {
      id: number;
      title: string;
      link: string;
      valid: Timestamp;
      parentId?: number;
      subs: Array<Category>;
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      STAGE: Stage;
      LOCALSTACK_URL: string;
      DYNAMO_TABLE_NAME: string;
      REQUESTS_IN_PARALLEL_AMOUNT: string;
    }
  }
}
