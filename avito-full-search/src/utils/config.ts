import {Stage} from '@constants/common';
import {DynamoDBClientConfig} from '@aws-sdk/client-dynamodb';
import {createLogger} from './logger';
import merge from 'lodash/merge';

export const getStage = () => process.env.STAGE || Stage.DEVELOPMENT;

export const getLocalstackUrl = () =>
  process.env.LOCALSTACK_URL || 'http://localhost:4566';

export const getDynamoConfig = (): DynamoDBClientConfig => {
  const dynamoLogger = createLogger('DynamoDB');
  const base: DynamoDBClientConfig = {logger: dynamoLogger};
  switch (getStage()) {
    case Stage.PRODUCTION: {
      return base;
    }
    case Stage.STAGE: {
      return base;
    }
    case Stage.DEVELOPMENT:
    case Stage.TEST: {
      return merge<DynamoDBClientConfig, DynamoDBClientConfig>(base, {
        endpoint: getLocalstackUrl(),
        region: 'us-east-1',
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
      });
    }
  }
};

export const getDynamoTable = (): string => process.env.DYNAMO_TABLE_NAME;

export const getRequestsAmountLimit = () =>
  parseInt(process.env.REQUESTS_IN_PARALLEL_AMOUNT, 10) || 10;
