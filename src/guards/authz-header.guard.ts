import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import type { IGymUserRequest } from '../types/gym-user-request.interface.js';
import { resolveAuthzHeader } from '../utils/resolve-authz-header.js';

@Injectable()
export class AuthzHeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers?: Record<string, unknown>; user?: IGymUserRequest }>();
    const headerValue = request.headers?.['x-authz'];

    request.user = resolveAuthzHeader(headerValue);

    return true;
  }
}
