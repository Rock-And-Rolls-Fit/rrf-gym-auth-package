import { SetMetadata } from '@nestjs/common';
import type { Actions } from '../types/actions.type.js';
import type { Subjects } from '../types/subjects.type.js';

export const CHECK_PERMISSION_KEY = 'check_permission';

export interface PermissionRequirement {
  action: Actions;
  subject: Subjects;
}

export const CheckPermission = (action: Actions, subject: Subjects) =>
  SetMetadata(CHECK_PERMISSION_KEY, { action, subject } as PermissionRequirement);
