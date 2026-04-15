# Authz Package — Redis Contract

## Redis Key Format

```
{prefix}:{roleName}
```

- **Default prefix**: `rrf:auth:gym:abilities`
- **Example**: `rrf:auth:gym:abilities:admin`
- **Writer**: `rrf-ms-auth` via `CaslCacheService` (uses `cache-manager` v7 + `@keyv/redis`)
- **Readers**: Consumer microservices via `@rockfit/gym-authz` (uses `keyv` + `@keyv/redis`)

## Value Schema

```typescript
IRawRule[] = Array<{
  action: 'manage' | 'create' | 'read' | 'update' | 'delete';
  subject: string;
  conditions?: Record<string, unknown> | null;
  fields?: string[] | null;
  inverted?: boolean;
  reason?: string | null;
}>
```

## TTL

Default: **3600 seconds** (configurable via `REDIS_RBAC_ABILITIES_TTL` in auth service).

## JWT User Claim Requirements

Consumer services must populate `request.user` with:

| Field | Type | Required | Source |
|-------|------|----------|--------|
| `userId` | `string` | Yes | JWT `sub` claim |
| `email` | `string` | Yes | JWT `email` claim |
| `roleName` | `string` | Yes | JWT `user_metadata.roleName` or resolved from `roleId` |
| `roleId` | `string` | Yes | JWT `user_metadata.roleId` |

The `roleName` is the key used to look up cached rules in Redis.

## Serialization Compatibility

`cache-manager` v7 internally uses Keyv for storage. The `@rockfit/gym-authz` package uses Keyv directly. Both must agree on:

1. **Namespace**: If cache-manager sets a Keyv namespace, the consumer package must use the same namespace via the `namespace` option in `AuthzModule.register()`.
2. **Serialization**: Keyv uses JSON serialization by default. Values are stored and retrieved as JSON-parsed objects.

If rules are not being read correctly, check the `namespace` configuration first.
