import { Inject, Injectable, Logger } from '@nestjs/common';
import Keyv from 'keyv';
import { AUTHZ_KEYV, AUTHZ_OPTIONS } from '../constants.js';
import type { AuthzModuleOptions } from '../config/authz-options.interface.js';
import type { IRawRule } from '../types/index.js';

@Injectable()
export class RedisRulesProvider {
  private readonly logger = new Logger(RedisRulesProvider.name);
  private readonly keyPrefix: string;

  constructor(
    @Inject(AUTHZ_KEYV)
    private readonly keyv: Keyv,
    @Inject(AUTHZ_OPTIONS)
    options: AuthzModuleOptions,
  ) {
    this.keyPrefix = options.redisKeyPrefix ?? 'rrf:auth:gym:abilities';
  }

  async getRules(roleName: string): Promise<IRawRule[] | null> {
    try {
      const key = `${this.keyPrefix}:${roleName}`;
      const cached = await this.keyv.get<IRawRule[]>(key);
      return cached ?? null;
    } catch (error) {
      this.logger.warn(
        `Redis read failed for role "${roleName}", denying by default`,
        error,
      );
      return null;
    }
  }
}
