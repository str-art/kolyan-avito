import {getDynamoConfig} from './config';
import {DynamoDB} from '@aws-sdk/client-dynamodb';

export const getDynamoClient = () => new DynamoDB(getDynamoConfig());
