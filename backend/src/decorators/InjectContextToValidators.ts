import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  PipeTransform,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { REQUEST_CONTEXT } from '@tokens';
import { omit } from 'lodash';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class InjectContextInterceptor implements NestInterceptor {
  constructor(private type?: 'query' | 'body' | 'params') {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    if (this.type && request[this.type]) {
      request[this.type][REQUEST_CONTEXT] = {
        user: request.user,
        schedules: request.schedules,
      };
    }

    return next.handle();
  }
}

@Injectable()
export class StripRequestContextPipe implements PipeTransform {
  transform(value: any) {
    return omit(value, REQUEST_CONTEXT);
  }
}

export function InjectContextToQuery() {
  return applyDecorators(InjectContextTo('query'));
}

export function InjectContextToBody() {
  return applyDecorators(InjectContextTo('body'));
}

export function InjectContextToParam() {
  return applyDecorators(InjectContextTo('params'));
}

export function InjectContextTo(context: 'query' | 'body' | 'params') {
  return applyDecorators(
    UseInterceptors(new InjectContextInterceptor(context)),
    UsePipes(StripRequestContextPipe),
  );
}
