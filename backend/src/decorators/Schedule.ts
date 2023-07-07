import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';
import { get } from 'lodash';

export const FindSchedule = createParamDecorator(
  (
    data: {
      paramName: string;
      throwIfNotFound: boolean;
    },
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest<Request>();
    const name = get(request.params, data.paramName);
    const { schedules } = request;
    const schedule = schedules.find((schedule) => name === schedule.name);
    if (data.throwIfNotFound && !schedule) {
      throw new NotFoundException(`Schedule ${name} is not found.`);
    }
    return { schedule };
  },
);
