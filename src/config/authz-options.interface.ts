import type { ModuleMetadata } from '@nestjs/common';

export interface AuthzModuleOptions {
  redisUrl: string;
  redisKeyPrefix?: string;
  namespace?: string;
}

export interface AuthzModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => AuthzModuleOptions | Promise<AuthzModuleOptions>;
  inject?: any[];
}
