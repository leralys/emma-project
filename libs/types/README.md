# @emma-project/types

Shared TypeScript types library for the Emma Project monorepo.

## Overview

This library contains common type definitions, interfaces, and DTOs that are shared between the frontend and backend applications.

## Usage

### In Backend (NestJS)

```typescript
import { User, CreateUserDto, ApiResponse } from '@emma-project/types';

// Use in controllers
@Post()
create(@Body() createUserDto: CreateUserDto): ApiResponse<User> {
  // ...
}
```

### In Frontend (React)

```typescript
import { User, ApiResponse, UserRole } from '@emma-project/types';

// Use in components
interface UserListProps {
  users: User[];
}

// Use with API calls
const fetchUser = async (id: string): Promise<ApiResponse<User>> => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};
```

## Available Types

### User Types

- `User` - User entity interface
- `CreateUserDto` - Data transfer object for creating users
- `UpdateUserDto` - Data transfer object for updating users
- `UserRole` - Enum for user roles (ADMIN, USER, GUEST)

### API Response Types

- `ApiResponse<T>` - Generic API response wrapper
- `PaginatedResponse<T>` - Paginated list response

### Common Types

- `ID` - Generic ID type (string | number)
- `Timestamps` - Common timestamp fields interface

## Adding New Types

1. Add your types to `src/lib/types.ts`
2. Export them from `src/index.ts` (if not already exported via `export * from './lib/types'`)
3. Build the library: `pnpm nx build types`
4. The types will be automatically available in all projects via the `@emma-project/types` import

## Path Alias

The library is available via the TypeScript path alias `@emma-project/types` configured in `tsconfig.base.json`.
