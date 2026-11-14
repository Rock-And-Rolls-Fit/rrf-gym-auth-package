import { ForbiddenException } from '@nestjs/common';
import type { IGymUserRequest } from '../types/gym-user-request.interface.js';

type AuthzHeaderPayload = Record<string, unknown>;

const REQUIRED_USER_FIELDS: Array<keyof IGymUserRequest> = [
  'userId',
  'email',
  'roleName',
  'roleId',
];

export function resolveAuthzHeader(headerValue: unknown): IGymUserRequest {
  if (typeof headerValue !== 'string') {
    throw new ForbiddenException('Invalid x-authz header');
  }

  let parsedHeader: unknown;

  try {
    parsedHeader = JSON.parse(headerValue);
  } catch {
    throw new ForbiddenException('Invalid x-authz header');
  }

  if (!isRecord(parsedHeader)) {
    throw new ForbiddenException('Invalid x-authz header');
  }

  const user = {} as IGymUserRequest;

  for (const field of REQUIRED_USER_FIELDS) {
    const value = parsedHeader[field];

    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new ForbiddenException('Invalid x-authz header');
    }

    user[field] = value;
  }

  return user;
}

function isRecord(value: unknown): value is AuthzHeaderPayload {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
