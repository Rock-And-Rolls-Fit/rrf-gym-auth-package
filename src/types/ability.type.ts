import { PureAbility } from '@casl/ability';
import type { Actions } from './actions.type.js';
import type { Subjects } from './subjects.type.js';

export type AppAbility = PureAbility<[Actions, Subjects]>;
