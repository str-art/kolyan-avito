import { AppModule } from '@modules/app.module';
import { LoggerService } from '@modules/utils/Logger';
import { NestFactory } from '@nestjs/core';
import * as serverlessExpress from '@vendia/serverless-express';
import { APIGatewayEvent, Context, Handler } from 'aws-lambda';
import { useContainer } from 'class-validator';

let handler: Handler<APIGatewayEvent, Context>;

async function bootstrap() {
  if (handler) {
    return handler;
  }

  const logger = new LoggerService('App');
  const app = await NestFactory.create(AppModule);
  app.useLogger(logger);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.init();
  handler = serverlessExpress.configure<APIGatewayEvent, Context>({
    app: app.getHttpAdapter().getInstance(),
    log: logger,
  });
  return handler;
}

// @ts-expect-error i dont understand how this types are not compatible.
export const handle: Handler<APIGatewayEvent, Context> = async (
  event,
  context,
  callback,
) => {
  const requestHandler = await bootstrap();
  return requestHandler(event, context, callback);
};
