export type DefaultSubjects =
  | 'Role'
  | 'Permission'
  | 'RolePermission'
  | 'GymAccount'
  | 'CustomerAccount'
  | 'Payment'
  | 'Subscription'
  | 'PreInscription'
  | 'Reports'
  | 'Finance'
  | 'all';

export type Subjects = DefaultSubjects | (string & {});
