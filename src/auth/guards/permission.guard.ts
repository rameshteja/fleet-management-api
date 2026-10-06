import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { AuthorizationService } from '../authorization.service';

import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';

import { Request } from 'express';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No permission requirement
    // means authentication alone is enough.
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;

    if (!user?.id || !user?.groupId) {
      throw new ForbiddenException(
        'User authentication information is missing.',
      );
    }

    for (const permission of requiredPermissions) {
      const hasPermission = await this.authorizationService.hasPermission(
        user.groupId,
        permission,
      );

      if (hasPermission) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You do not have permission to perform this action.',
    );
  }
}
