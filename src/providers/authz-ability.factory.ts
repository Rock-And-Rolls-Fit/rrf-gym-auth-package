import { Injectable } from '@nestjs/common';
import { PureAbility, AbilityBuilder } from '@casl/ability';
import { RedisRulesProvider } from './redis-rules.provider.js';
import type { AppAbility } from '../types/ability.type.js';
import type { IRawRule } from '../types/raw-rule.interface.js';

@Injectable()
export class AuthzAbilityFactory {
  constructor(private readonly rulesProvider: RedisRulesProvider) {}

  async createForRole(roleName: string): Promise<AppAbility> {
    const rules = await this.rulesProvider.getRules(roleName);
    return this.buildAbility(rules ?? []);
  }

  buildAbility(rules: IRawRule[]): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

    for (const rule of rules) {
      if (rule.inverted) {
        cannot(
          rule.action,
          rule.subject,
          rule.fields ?? undefined,
          rule.conditions ?? undefined,
        );
      } else {
        can(
          rule.action,
          rule.subject,
          rule.fields ?? undefined,
          rule.conditions ?? undefined,
        );
      }
    }

    return build();
  }
}
