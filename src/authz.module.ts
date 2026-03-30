import { DynamicModule, Module } from '@nestjs/common';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { AUTHZ_KEYV, AUTHZ_OPTIONS } from './constants.js';
import type {
  AuthzModuleOptions,
  AuthzModuleAsyncOptions,
} from './config/authz-options.interface.js';
import { AuthzHeaderGuard } from './guards/authz-header.guard.js';
import { RedisRulesProvider } from './providers/redis-rules.provider.js';
import { AuthzAbilityFactory } from './providers/authz-ability.factory.js';
import { PermissionsGuard } from './guards/permissions.guard.js';

@Module({})
export class AuthzModule {
  static register(options: AuthzModuleOptions): DynamicModule {
    return {
      module: AuthzModule,
      providers: [
        {
          provide: AUTHZ_OPTIONS,
          useValue: {
            redisKeyPrefix: 'rrf:auth:gym:abilities',
            ...options,
          },
        },
        {
          provide: AUTHZ_KEYV,
          useFactory: () => {
            const store = new KeyvRedis(options.redisUrl);
            return new Keyv({ store, namespace: options.namespace });
          },
        },
        RedisRulesProvider,
        AuthzAbilityFactory,
        AuthzHeaderGuard,
        PermissionsGuard,
      ],
      exports: [
        RedisRulesProvider,
        AuthzAbilityFactory,
        AuthzHeaderGuard,
        PermissionsGuard,
      ],
    };
  }

  static registerAsync(asyncOptions: AuthzModuleAsyncOptions): DynamicModule {
    return {
      module: AuthzModule,
      imports: asyncOptions.imports ?? [],
      providers: [
        {
          provide: AUTHZ_OPTIONS,
          useFactory: async (...args: any[]) => {
            const options = await asyncOptions.useFactory(...args);
            return {
              redisKeyPrefix: 'rrf:auth:gym:abilities',
              ...options,
            };
          },
          inject: asyncOptions.inject ?? [],
        },
        {
          provide: AUTHZ_KEYV,
          useFactory: (options: AuthzModuleOptions) => {
            const store = new KeyvRedis(options.redisUrl);
            return new Keyv({ store, namespace: options.namespace });
          },
          inject: [AUTHZ_OPTIONS],
        },
        RedisRulesProvider,
        AuthzAbilityFactory,
        AuthzHeaderGuard,
        PermissionsGuard,
      ],
      exports: [
        RedisRulesProvider,
        AuthzAbilityFactory,
        AuthzHeaderGuard,
        PermissionsGuard,
      ],
    };
  }
}
