---
name: conductor-context
description: Auto-load Conductor project context when conductor/ directory exists. Use for any development task in a Conductor-managed project to ensure alignment with product goals, tech stack, and workflow methodology.
allowed-tools: Read, Glob
---

# Conductor Context Awareness

This skill provides automatic context loading for Conductor-managed projects.

## When to Activate

Activate this skill when:
- A `conductor/` directory exists in the project
- User is asking about implementation tasks
- User is working on features or bugs
- User mentions "the plan" or "tracks"

## Context Files

When detected, consider these files:

### 1. Product Context (`conductor/product.md`)

Contains:
- Product vision and goals
- Target users
- Key features
- Success metrics

**Use for**: Understanding WHAT we're building and WHY.

### 2. Tech Stack (`conductor/tech-stack.md`)

Contains:
- Programming languages
- Frameworks
- Databases
- Key libraries
- Architecture decisions

**Use for**: Making technology choices consistent with project standards.

### 3. Workflow (`conductor/workflow.md`)

Contains:
- Development methodology (likely TDD)
- Coverage requirements
- Commit conventions
- Quality gates

**Use for**: Following the established development process.

### 4. Tracks (`conductor/tracks.md`)

Contains:
- List of all tracks (features/bugs)
- Current status of each
- Links to track details

**Use for**: Understanding current work and priorities.

### 5. Code Styleguides (`conductor/code_styleguides/`)

Contains:
- Language-specific coding standards
- Naming conventions
- Best practices

**Use for**: Writing code that matches project conventions.

## Quick Reference

### Before Starting Implementation

1. Check `conductor/tracks.md` for current track
2. Read the track's `spec.md` for requirements
3. Read the track's `plan.md` for tasks
4. Follow `conductor/workflow.md` methodology

### During Implementation

- Follow TDD if specified in workflow.md
- Meet coverage targets from workflow.md
- Use commit format from workflow.md
- Apply styleguides from code_styleguides/

### Key Context Points

| Aspect | Where to Find |
|--------|---------------|
| Coverage target | workflow.md |
| Commit format | workflow.md |
| Test methodology | workflow.md |
| Technology choices | tech-stack.md |
| Coding style | code_styleguides/ |
| Current focus | tracks.md |

## Integration with Other Skills

This skill works with:
- **tdd-workflow**: For test-driven development guidance
- **code-styleguides**: For language-specific conventions

## Common Patterns

### Finding Current Task

```bash
# Find in-progress items
grep -r "\[~\]" conductor/tracks/*/plan.md
```

### Understanding Track Status

```bash
# Count by status
grep -c "\[ \]" conductor/tracks.md  # Pending
grep -c "\[~\]" conductor/tracks.md  # In Progress
grep -c "\[x\]" conductor/tracks.md  # Complete
```

### Loading Full Context

Read in this order:
1. `conductor/product.md` (the why)
2. `conductor/tech-stack.md` (the how)
3. `conductor/tracks.md` (the what)
4. Current track's `spec.md` and `plan.md`
