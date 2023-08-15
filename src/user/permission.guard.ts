import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService) private userService: UserService;
  @Inject(Reflector) private reflector: Reflector;
  @Inject(RedisService) private redisService: RedisService;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    console.log(request.session);

    const user = request.session?.user;

    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }
    //! 使用redis做缓存
    let permissionList = await this.redisService.listGet(
      `user_${user.username}_permissions`,
    );
    console.warn(permissionList);

    if (!permissionList.length) {
      console.log('通过数据库查询');

      const foundUser = await this.userService.findByUsername(user.username);
      permissionList = foundUser.permissions.map((item) => item.name);
      //! 持久化权限表
      this.redisService.listSet(
        `user_${user.username}_permissions`,
        permissionList,
        60 * 30,
      );
    }
    //! 通过反射拿到handker的setMataData
    const permission = this.reflector.get('permission', context.getHandler());

    if (permissionList.some((item) => item == permission)) {
      return true;
    } else {
      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
