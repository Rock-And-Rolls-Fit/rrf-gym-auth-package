import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthzAbilityFactory } from '../providers/authz-ability.factory.js';
import {
  CHECK_PERMISSION_KEY,
  type PermissionRequirement,
} from '../decorators/check-permission.decorator.js';
import {
  CHECK_POLICIES_KEY,
  type PolicyHandler,
} from '../decorators/check-policies.decorator.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import type { IGymUserRequest } from '../types/gym-user-request.interface.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: AuthzAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const permReq = this.reflector.get<PermissionRequirement>(
      CHECK_PERMISSION_KEY,
      context.getHandler(),
    );

    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    if (!permReq && policyHandlers.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user: IGymUserRequest = request.user;

    if (!user?.roleName) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    const ability = await this.abilityFactory.createForRole(user.roleName);

    if (permReq && !ability.can(permReq.action, permReq.subject)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    if (policyHandlers.length > 0 && !policyHandlers.every((h) => h(ability))) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
