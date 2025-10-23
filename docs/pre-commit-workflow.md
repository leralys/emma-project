# Pre-commit Workflow

## 🔄 What Happens on Every Commit

When you run `git commit`, the following happens automatically:

### 1. Husky Triggers

The pre-commit hook (`.husky/pre-commit`) runs before the commit is created.

### 2. lint-staged Processes Staged Files

Only the files you've staged (with `git add`) are processed:

```bash
pnpm exec lint-staged
```

### 3. Files Are Processed

**For `.{js,jsx,ts,tsx,json,css,scss,md}` files:**

```bash
prettier --write <files>
```

- Formats code
- Organizes imports (via prettier-plugin-organize-imports)
- Sorts Tailwind classes (via prettier-plugin-tailwindcss)

**For `.{js,jsx,ts,tsx}` files:**

```bash
eslint --fix <files>
```

- Fixes auto-fixable linting errors
- Reports unfixable errors (commit will fail if there are any)

### 4. Auto-staging

If files are modified by Prettier or ESLint, they're automatically re-staged.

### 5. Commit Succeeds or Fails

- ✅ **Success**: If all checks pass, your commit is created
- ❌ **Failure**: If there are unfixable linting errors, commit is blocked

---

## 📝 Example Workflow

### Typical Commit

```bash
# 1. Make changes to files
vim apps/frontend/src/app/MyComponent.tsx

# 2. Stage your changes
git add apps/frontend/src/app/MyComponent.tsx

# 3. Commit
git commit -m "feat: add MyComponent"

# 🔄 What happens automatically:
# - lint-staged runs
# - Prettier formats MyComponent.tsx
# - Imports are organized
# - Tailwind classes are sorted
# - ESLint checks for errors and fixes what it can
# - If everything passes, commit is created!
```

### If There Are Errors

```bash
git commit -m "feat: add broken code"

# Output:
✖ eslint --fix:
  /path/to/file.tsx
    45:5  error  'myVar' is not defined  no-undef

✖ lint-staged failed!
# Commit is blocked

# Fix the errors:
vim apps/frontend/src/app/file.tsx

# Try again:
git add apps/frontend/src/app/file.tsx
git commit -m "feat: add working code"
# ✅ Success!
```

---

## ⚡ Performance Comparison

### Before (without lint-staged)

```bash
# Processes ENTIRE codebase
pnpm format  # ~5-10 seconds
pnpm lint    # ~8-15 seconds
# Total: ~13-25 seconds per commit 😱
```

### After (with lint-staged)

```bash
# Processes ONLY staged files
pnpm exec lint-staged  # ~0.5-2 seconds
# Total: ~0.5-2 seconds per commit 🚀
```

**Result:** 10-50x faster commits!

---

## 🎯 Configuration

### package.json

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,scss,md}": ["prettier --write"],
    "*.{js,jsx,ts,tsx}": ["eslint --fix"]
  }
}
```

### .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged to format and lint only staged files
pnpm exec lint-staged
```

---

## 🔧 Customization Options

### Add TypeScript Type Checking

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,scss,md}": ["prettier --write"],
    "*.{ts,tsx}": ["bash -c 'tsc --noEmit'", "eslint --fix"]
  }
}
```

### Add Tests for Changed Files

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,scss,md}": ["prettier --write"],
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "bash -c 'pnpm nx affected -t test --files=$1'"]
  }
}
```

### Different Rules for Different Directories

```json
{
  "lint-staged": {
    "apps/frontend/**/*.{ts,tsx}": ["prettier --write", "eslint --fix"],
    "apps/backend/**/*.ts": ["prettier --write", "eslint --fix"],
    "*.md": ["prettier --write"]
  }
}
```

---

## 🔄 Amending Commits

The pre-commit hook runs for **all commits**, including amends:

### Regular Amend (runs hooks)

```bash
# Amend last commit and run lint-staged
git commit --amend --no-edit

# Or with new message
git commit --amend -m "new message"
```

### Amend Without Running Hooks

```bash
# Skip hooks when amending (useful if code was already checked)
git commit --amend --no-edit --no-verify

# Or with new message
git commit --amend --no-verify -m "fix: update commit message"
```

**When to use `--no-verify` with amend:**

- ✅ Just fixing a typo in the commit message
- ✅ Code was already linted in previous commit
- ❌ Adding new code changes (let the hooks run!)

---

## 🚫 Skip Pre-commit (Emergency Use Only)

Sometimes you need to commit without running checks:

```bash
# Skip all hooks
git commit --no-verify -m "WIP: emergency hotfix"

# Skip hooks when amending
git commit --amend --no-verify --no-edit
```

**⚠️ Warning:** Use this sparingly! Your code won't be formatted or linted.

---

## 🐛 Troubleshooting

### Hook Not Running

```bash
# Reinstall Husky
pnpm prepare

# Make hook executable
chmod +x .husky/pre-commit
```

### lint-staged Not Found

```bash
# Reinstall dependencies
pnpm install
```

### Commit is Slow

```bash
# Check what's taking time
DEBUG=lint-staged* git commit -m "test"

# If too many files are staged, consider:
git reset
git add <specific-files>
git commit -m "message"
```

### Auto-fixes Keep Changing Files

This is normal! lint-staged automatically re-stages the formatted files.

---

## 📊 What Files Are Checked?

Run this to see what will be processed:

```bash
git diff --cached --name-only | grep -E '\.(js|jsx|ts|tsx|json|css|scss|md)$'
```

---

## ✅ Benefits

1. **Fast Commits** - Only process changed files
2. **Consistent Code Style** - Everyone's commits are formatted
3. **Catch Errors Early** - Find issues before they reach CI/CD
4. **No Manual Formatting** - Automatic on every commit
5. **Team Consistency** - Same rules for everyone

---

## 🎓 Best Practices

1. **Commit Often** - Small commits are faster to process
2. **Stage Related Files** - Keep commits focused
3. **Fix Errors Promptly** - Don't ignore lint errors
4. **Trust the Tools** - Let Prettier handle formatting
5. **Use --no-verify Sparingly** - Only in emergencies

---

## 📚 Learn More

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Prettier Documentation](https://prettier.io/)
- [ESLint Documentation](https://eslint.org/)
