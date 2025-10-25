# Git Commands Cheatsheet with Hooks

Quick reference for common git commands and how they interact with pre-commit hooks.

## 📝 Regular Commits

### With Hooks (Default)

```bash
# Stage files
git add .

# Commit (runs lint-staged)
git commit -m "feat: add new feature"
```

**What happens:**

- ✅ Pre-commit hook runs
- ✅ lint-staged formats and lints staged files (JS/TS/CSS/MD/Prisma)
- ✅ Commit is created if all checks pass

### Without Hooks

```bash
git commit --no-verify -m "WIP: work in progress"
```

**What happens:**

- ❌ Pre-commit hook is skipped
- ⚠️ Files are NOT formatted or linted
- ✅ Commit is created immediately

---

## 🔄 Amending Commits

### Amend with Hooks (Recommended)

```bash
# Make changes to files
vim src/file.ts

# Stage changes
git add src/file.ts

# Amend last commit (runs lint-staged)
git commit --amend --no-edit
```

**What happens:**

- ✅ Pre-commit hook runs on newly staged files
- ✅ Files are formatted and linted
- ✅ Last commit is updated

### Amend Message Only (with Hooks)

```bash
# Just changing commit message
git commit --amend -m "fix: better commit message"
```

**What happens:**

- ✅ Pre-commit hook runs (but no files are staged, so it's fast)
- ✅ Commit message is updated

### Amend without Hooks

```bash
# Skip hooks when only changing message
git commit --amend --no-edit --no-verify

# Or with new message
git commit --amend --no-verify -m "fix: typo in message"
```

**What happens:**

- ❌ Pre-commit hook is skipped
- ✅ Commit is updated immediately

**When to use:**

- ✅ Just fixing commit message typo
- ✅ Files were already linted in previous commit
- ❌ Don't use if adding new code changes!

---

## 📦 Common Workflows

### Fix and Amend

```bash
# 1. Commit your work
git commit -m "feat: add feature"

# 2. Realize you forgot something
vim src/file.ts

# 3. Stage the fix
git add src/file.ts

# 4. Amend the commit (with hooks)
git commit --amend --no-edit
```

### Quick Message Fix

```bash
# 1. Just committed with typo
git commit -m "feat: ad feature"  # Oops! "ad" instead of "add"

# 2. Fix message without re-running hooks
git commit --amend --no-verify -m "feat: add feature"
```

### Multiple Small Changes

```bash
# 1. Make change
git add file1.ts
git commit -m "feat: part 1"

# 2. Make another change
git add file2.ts
git commit -m "feat: part 2"

# 3. Squash commits later
git rebase -i HEAD~2
```

---

## 🎯 Best Practices

### ✅ DO

```bash
# Let hooks run for new code
git commit -m "feat: add feature"
git commit --amend --no-edit  # when adding more code

# Use --no-verify only for message fixes
git commit --amend --no-verify -m "fix: typo"

# Stage related files together
git add src/feature.ts src/feature.test.ts
git commit -m "feat: add feature with tests"
```

### ❌ DON'T

```bash
# Don't skip hooks for new code
git commit --no-verify -m "feat: unformatted code"  # Bad!

# Don't use --no-verify as default
alias gc="git commit --no-verify"  # Bad practice!

# Don't stage unrelated files
git add .  # Be selective instead
```

---

## 🚀 Performance Tips

### Fast Commits

```bash
# Only stage specific files (faster lint-staged)
git add src/component.tsx
git commit -m "feat: update component"
```

### Slow Commits?

```bash
# Check what's being linted
git diff --cached --name-only

# If too many files, consider splitting:
git reset
git add src/feature/*
git commit -m "feat: add feature"
git add src/other/*
git commit -m "feat: add other"
```

---

## 🔍 Debugging

### See What Will Be Processed

```bash
# List staged files
git diff --cached --name-only

# See files that match lint-staged patterns
git diff --cached --name-only | grep -E '\.(js|jsx|ts|tsx|prisma)$'
```

### Test lint-staged Manually

```bash
# Stage files
git add src/file.ts

# Run lint-staged without committing
pnpm exec lint-staged

# If successful, commit
git commit -m "feat: add feature"
```

### Check Hook Status

```bash
# Verify hook exists and is executable
ls -la .husky/pre-commit

# Make it executable if needed
chmod +x .husky/pre-commit

# View hook contents
cat .husky/pre-commit
```

---

## 📊 Hook Behavior Matrix

| Command                                    | Hooks Run? | When to Use                       |
| ------------------------------------------ | ---------- | --------------------------------- |
| `git commit -m "..."`                      | ✅ Yes     | Always (default)                  |
| `git commit --no-verify -m "..."`          | ❌ No      | Emergency only                    |
| `git commit --amend --no-edit`             | ✅ Yes     | Adding code to last commit        |
| `git commit --amend --no-verify --no-edit` | ❌ No      | Fixing commit message only        |
| `git commit --amend -m "..."`              | ✅ Yes     | Changing message + running checks |
| `git commit --amend --no-verify -m "..."`  | ❌ No      | Quick message typo fix            |

---

## 💡 Pro Tips

### Alias Setup

```bash
# Add to ~/.gitconfig or ~/.zshrc

# Regular commit (with hooks)
alias gc="git commit"
alias gcm="git commit -m"

# Amend (with hooks)
alias gca="git commit --amend --no-edit"
alias gcam="git commit --amend"

# Amend message only (without hooks)
alias gcamsg="git commit --amend --no-verify"

# Emergency skip (use sparingly!)
alias gcnv="git commit --no-verify -m"
```

### Smart Staging

```bash
# Interactive staging (pick specific changes)
git add -p

# Stage only modified files (not new files)
git add -u

# Stage everything
git add .
```

### Undo Last Commit (Keep Changes)

```bash
# Undo commit but keep changes staged
git reset --soft HEAD~1

# Fix the changes
vim src/file.ts

# Commit again (hooks will run)
git commit -m "feat: correct implementation"
```

---

## 🎓 Remember

1. **Hooks are your friend** - They catch issues before they reach CI/CD
2. **--no-verify is for emergencies** - Use it sparingly
3. **Small commits are faster** - lint-staged only checks staged files
4. **Trust the automation** - Let Prettier and ESLint do their job
5. **Message fixes don't need hooks** - Use `--no-verify` for typo corrections

---

## 📚 Related Documentation

- [Pre-commit Workflow](pre-commit-workflow.md) - Detailed explanation
- [Code Quality Setup](code-quality-setup.md) - Configuration details
- [Git Documentation](https://git-scm.com/doc) - Official Git docs
