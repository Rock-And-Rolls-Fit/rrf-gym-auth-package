import type { Actions } from './actions.type.js';
import type { Subjects } from './subjects.type.js';

export interface IRawRule {
  action: Actions;
  subject: Subjects;
  conditions?: Record<string, unknown> | null;
  fields?: string[] | null;
  inverted?: boolean;
  reason?: string | null;
}
