import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
//! 由于Session中没有 user类型，所以需要拓展下
//! 同名 interface 会自动合并的特点来扩展 Session
declare module 'express-session' {
  interface Session {
    user: {
      username: string;
    };
  }
}

//! 使用loginGuard来进行登录校验，有些接口的访问需要用户已经登录
@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.session?.user) {
      throw new UnauthorizedException('用户未登录');
    }

    return true;
  }
}

interface A {
  username: string;
}

interface A {
  password: string;
}

const a: A = {
  username: '',
  password: '',
};
