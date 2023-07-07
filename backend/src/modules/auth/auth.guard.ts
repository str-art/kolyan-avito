import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

const AUTH_HEADER = 'Authorization';

const BEARER = 'Bearer';

const HEADER_SPLITTER = '::';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.header(AUTH_HEADER);

    if (!authHeader) {
      return false;
    }

    const [bearer, userToken] = authHeader.split(' ');

    if (bearer !== BEARER) {
      return false;
    }

    const [userId, chatId] = userToken.split(HEADER_SPLITTER);

    if (!userId || !chatId) {
      return false;
    }

    request.userId = userId;
    request.chatId = chatId;

    request.user = {
      id: userId,
      chatId,
    };

    return true;
  }
}
