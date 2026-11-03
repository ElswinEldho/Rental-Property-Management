/**
 * System RBAC Roles
 */
export const Roles = Object.freeze({
  ADMIN: 'ADMIN',
  PROPERTY_MANAGER: 'PROPERTY_MANAGER',
  TENANT: 'TENANT',
});

export const ALL_ROLES = Object.freeze([
  Roles.ADMIN,
  Roles.PROPERTY_MANAGER,
  Roles.TENANT,
]);

