import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Schedules = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const { schedules } = request;
    return schedules;
  },
);
