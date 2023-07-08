import { AWS, PARSER_ARN, ROLE_ARN, SCHEDULER } from '@tokens';
import { SchedulerClientConfig } from '@aws-sdk/client-scheduler';
import { LoggerService } from '@modules/utils/Logger';

export class Config {
  private static env = process.env.NODE_ENV || 'development';

  static get [AWS](): Aws.IBaseConfig {
    switch (this.env) {
      case 'testing':
      case 'development': {
        return {
          region: process.env.AWS_DEFAULT_REGION,
        };
      }
      case 'production': {
        return {};
      }
    }
  }

  static get [SCHEDULER](): SchedulerClientConfig {
    return { ...this[AWS], logger: new LoggerService('Scheduler AWS Sdk') };
  }

  static get [PARSER_ARN]() {
    return process.env[PARSER_ARN];
  }
  static get [ROLE_ARN]() {
    return process.env[ROLE_ARN];
  }
}
