export type DefaultSubjects =
  | 'Role'
  | 'Permission'
  | 'RolePermission'
  | 'GymAccount'
  | 'CustomerAccount'
  | 'Payment'
  | 'Subscription'
  | 'PreInscription'
  | 'all';

export type Subjects = DefaultSubjects | (string & {});
