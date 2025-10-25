# Code Quality Setup

## 🎨 Prettier Configuration

### Installed Plugins

1. **prettier-plugin-organize-imports** - Automatically organizes and sorts imports
2. **prettier-plugin-tailwindcss** - Sorts Tailwind CSS classes in recommended order
3. **prettier-plugin-prisma** - Formats Prisma schema files

### Configuration (`.prettierrc`)

```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": [
    "prettier-plugin-organize-imports",
    "prettier-plugin-prisma",
    "prettier-plugin-tailwindcss"
  ]
}
```

**Note:** Plugin order matters! `prettier-plugin-tailwindcss` must be last.

### Features

**Organize Imports:**

```typescript
// Before
import { useState } from 'react';
import { format } from 'date-fns';
import { ApiResponse } from '@emma-project/types';
import React from 'react';

// After (automatically sorted)
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ApiResponse } from '@emma-project/types';
```

**Sort Tailwind Classes:**

```tsx
// Before
<div className="text-white p-4 bg-blue-500 rounded-lg flex">

// After (automatically sorted by Tailwind's recommended order)
<div className="flex rounded-lg bg-blue-500 p-4 text-white">
```

**Format Prisma Schema:**

```prisma
// Automatically formats on save or commit
model User {
  id        String   @id @default(cuid())
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### Usage

```bash
# Format all files
pnpm format

# Check formatting without modifying
pnpm format:check
```

---

## 🐕 Husky Git Hooks

### Pre-commit Hook

Automatically runs before every commit to ensure code quality:

```bash
# .husky/pre-commit
pnpm exec lint-staged
```

**What it does:**

- Runs **only on staged files** (the files you're committing)
- Formats code with Prettier
- Fixes ESLint issues automatically
- Much faster than running on the entire codebase!

### Setup

Husky is automatically initialized when you run `pnpm install` thanks to the `prepare` script in `package.json`:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

### lint-staged Configuration

Configuration in `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,scss,md,prisma}": ["prettier --write"],
    "*.{js,jsx,ts,tsx}": ["eslint --fix"]
  }
}
```

**What happens on commit:**

1. Only staged files matching the patterns are processed
2. Prettier formats them (including `.prisma` files)
3. ESLint fixes any auto-fixable issues
4. Fixed files are automatically staged

### Customizing Hooks

You can add more commands to `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged (required)
pnpm exec lint-staged

# Optional: Run type checking on staged files
pnpm typecheck

# Optional: Run tests on affected projects
pnpm nx affected -t test
```

### Amending Commits

```bash
# Amend with hooks (recommended)
git commit --amend --no-edit

# Amend without hooks (use when only changing commit message)
git commit --amend --no-edit --no-verify
```

### Skip Hooks (When Needed)

```bash
# Skip pre-commit hook for regular commit
git commit --no-verify -m "your message"

# Skip pre-commit hook when amending
git commit --amend --no-verify --no-edit
```

⚠️ **Note:** Only skip hooks when absolutely necessary!

---

## 🎯 React Icons

### Overview

**react-icons** provides popular icon sets as React components:

- Font Awesome
- Material Design
- Heroicons
- Bootstrap Icons
- And many more!

### Usage

```tsx
import { FaHeart, FaUser, FaShoppingCart } from 'react-icons/fa';
import { MdEmail, MdNotifications } from 'react-icons/md';
import { HiHome, HiMenu } from 'react-icons/hi';
import { BiLoaderAlt } from 'react-icons/bi';
import { AiOutlineSearch } from 'react-icons/ai';

function MyComponent() {
  return (
    <div className="flex items-center gap-4">
      <FaHeart className="text-red-500" size={24} />
      <FaUser className="text-blue-500" size={20} />
      <MdEmail className="text-gray-700" />
      <HiHome size={32} />
      <BiLoaderAlt className="animate-spin" size={24} />
    </div>
  );
}
```

### Available Icon Sets

| Prefix | Icon Set        | Import Example                                   |
| ------ | --------------- | ------------------------------------------------ |
| `Fa`   | Font Awesome    | `import { FaHome } from 'react-icons/fa'`        |
| `Md`   | Material Design | `import { MdEmail } from 'react-icons/md'`       |
| `Hi`   | Heroicons       | `import { HiMenu } from 'react-icons/hi'`        |
| `Bi`   | Bootstrap Icons | `import { BiUser } from 'react-icons/bi'`        |
| `Ai`   | Ant Design      | `import { AiOutlineHome } from 'react-icons/ai'` |
| `Bs`   | Bootstrap       | `import { BsHeart } from 'react-icons/bs'`       |
| `Fi`   | Feather         | `import { FiHome } from 'react-icons/fi'`        |
| `Io`   | Ionicons        | `import { IoMdHome } from 'react-icons/io'`      |

### Common Props

```tsx
<IconComponent
  size={24}              // Icon size in pixels
  color="red"            // Icon color
  className="..."        // CSS classes (including Tailwind)
  style={{ ... }}        // Inline styles
  onClick={() => {}}     // Event handlers
/>
```

### Examples

**Navigation:**

```tsx
import { HiHome, HiUser, HiCog } from 'react-icons/hi';

<nav className="flex gap-4">
  <HiHome className="text-gray-700 hover:text-blue-500" size={24} />
  <HiUser className="text-gray-700 hover:text-blue-500" size={24} />
  <HiCog className="text-gray-700 hover:text-blue-500" size={24} />
</nav>;
```

**Loading Spinner:**

```tsx
import { BiLoaderAlt } from 'react-icons/bi';

<BiLoaderAlt className="animate-spin text-blue-500" size={32} />;
```

**Buttons:**

```tsx
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

<button className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white">
  <FaPlus /> Add Item
</button>

<button className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white">
  <FaTrash /> Delete
</button>
```

**Search:**

```tsx
import { AiOutlineSearch } from 'react-icons/ai';

<div className="relative">
  <input type="text" placeholder="Search..." className="rounded-lg border px-4 py-2 pl-10" />
  <AiOutlineSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
</div>;
```

### Find More Icons

Browse all available icons at: [https://react-icons.github.io/react-icons/](https://react-icons.github.io/react-icons/)

---

## 📋 Complete Workflow

### Before Committing

1. **Write your code**
2. **Format is automatic** - Prettier runs on commit via Husky
3. **Lint is automatic** - ESLint checks run on commit via Husky
4. **If checks pass** - Commit succeeds
5. **If checks fail** - Fix the issues and try again

### Manual Commands

```bash
# Format code manually
pnpm format

# Check linting
pnpm lint

# Type check
pnpm typecheck

# Run all quality checks
pnpm format && pnpm lint && pnpm typecheck
```

---

## 🔧 VSCode Integration

### Recommended Extensions

Add to `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [["className\\s*[=:]\\s*['\"]([^'\"]*)['\"]", "([^'\"]*)"]]
}
```

This will:

- Auto-format on save with Prettier
- Auto-fix ESLint issues on save
- Enable Tailwind IntelliSense

---

## 📦 Installed Packages Summary

| Package                            | Version | Purpose                      |
| ---------------------------------- | ------- | ---------------------------- |
| `react-icons`                      | ^5.5.0  | Icon library for React       |
| `husky`                            | ^9.1.7  | Git hooks management         |
| `lint-staged`                      | ^16.2.6 | Run commands on staged files |
| `prettier`                         | ^3.6.2  | Code formatter               |
| `prettier-plugin-organize-imports` | ^4.3.0  | Auto-organize imports        |
| `prettier-plugin-prisma`           | ^5.0.0  | Format Prisma schema files   |
| `prettier-plugin-tailwindcss`      | ^0.7.1  | Sort Tailwind classes        |
