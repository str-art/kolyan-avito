import { Module } from '@nestjs/common';
import { awsSdkProviders } from './sdk.providers';

@Module({
  providers: awsSdkProviders,
  exports: awsSdkProviders,
})
export class AwsModule {}
