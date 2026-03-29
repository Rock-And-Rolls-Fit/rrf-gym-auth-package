# @rock-and-rolls-fit/rrf-gym-auth-package

Reusable authorization package for RockFit microservices. Reads CASL permission rules cached in Redis by `rrf-ms-auth` and evaluates endpoint authorization.

## Installation

```bash
bun add @rock-and-rolls-fit/rrf-gym-auth-package
```

Peer dependencies (must be installed in the consumer):

```bash
bun add @casl/ability @nestjs/common @nestjs/core
```

## Usage

### 1. Import the module

```typescript
import { AuthzModule } from '@rock-and-rolls-fit/rrf-gym-auth-package';

@Module({
  imports: [
    AuthzModule.register({
      redisUrl: process.env.REDIS_URL,
      redisKeyPrefix: 'rrf:auth:gym:abilities', // default
    }),
  ],
})
export class AppModule {}
```

With `ConfigService`:

```typescript
AuthzModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    redisUrl: config.getOrThrow('REDIS_URL'),
  }),
});
```

### 2. Protect endpoints

Your JWT auth guard must populate `request.user` with `{ userId, email, roleName, roleId }` before `PermissionsGuard` runs.

```typescript
import { CheckPermission, PermissionsGuard } from '@rock-and-rolls-fit/rrf-gym-auth-package';

@Controller('payments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaymentsController {
  @Get()
  @CheckPermission('read', 'Payment')
  findAll() { ... }

  @Post()
  @CheckPermission('create', 'Payment')
  create() { ... }
}
```

### 3. Advanced: policy handlers

For complex authorization logic, use `@CheckPolicies`:

```typescript
import { CheckPolicies } from '@rock-and-rolls-fit/rrf-gym-auth-package';

@Get('sensitive')
@CheckPolicies((ability) => ability.can('read', 'Payment') && ability.can('read', 'Subscription'))
findSensitive() { ... }
```

## Redis Key Contract

`rrf-ms-auth` caches rules per role in Redis:

- **Key format**: `{prefix}:{roleName}` (e.g., `rrf:auth:gym:abilities:admin`)
- **Value**: JSON `IRawRule[]`
- **TTL**: 3600s (configurable in auth service)

This package is **read-only** — it never writes to Redis.

## Exported Types

| Type | Description |
|------|-------------|
| `Actions` | `'manage' \| 'create' \| 'read' \| 'update' \| 'delete'` |
| `Subjects` | Default subjects union (extensible with `string & {}`) |
| `IRawRule` | Raw CASL rule shape stored in Redis |
| `IGymUserRequest` | User object expected on `request.user` |
| `AppAbility` | `PureAbility<[Actions, Subjects]>` |
