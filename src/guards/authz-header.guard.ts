import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { IGymUserRequest } from '../types/gym-user-request.interface.js';

type AuthzHeaderPayload = Record<string, unknown>;

const REQUIRED_USER_FIELDS: Array<keyof IGymUserRequest> = [
  'userId',
  'email',
  'roleName',
  'roleId',
];

@Injectable()
export class AuthzHeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers?: Record<string, unknown>; user?: IGymUserRequest }>();
    const headerValue = request.headers?.['x-authz'];

    if (typeof headerValue !== 'string') {
      throw new ForbiddenException('Invalid x-authz header');
    }

    let parsedHeader: unknown;

    try {
      parsedHeader = JSON.parse(headerValue);
    } catch {
      throw new ForbiddenException('Invalid x-authz header');
    }

    request.user = this.buildUser(parsedHeader);

    return true;
  }

  private buildUser(payload: unknown): IGymUserRequest {
    if (!this.isRecord(payload)) {
      throw new ForbiddenException('Invalid x-authz header');
    }

    const user = {} as IGymUserRequest;

    for (const field of REQUIRED_USER_FIELDS) {
      const value = payload[field];

      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new ForbiddenException('Invalid x-authz header');
      }

      user[field] = value;
    }

    return user;
  }

  private isRecord(value: unknown): value is AuthzHeaderPayload {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
