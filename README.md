# Conductor

Context-Driven Development framework for Claude Code.

> Inspired by [Conductor for Gemini CLI](https://github.com/gemini-cli-extensions/conductor)

## Overview

Conductor enables **Context-Driven Development** - a methodology where context is treated as a managed artifact alongside code. It provides:

- **Pre-implementation Planning**: Generate specs and plans before coding
- **Test-Driven Development**: Enforced Red-Green-Refactor cycles
- **Context Management**: Maintain style guides, tech stack, product goals
- **Iterative Safety**: Review plans before execution with checkpoints
- **Intelligent Reversion**: Git-aware rollback of logical work units

## Installation

### Development / Testing

Load the plugin directly using the `--plugin-dir` flag:

```bash
claude --plugin-dir /path/to/conductor
```

**Verify installation:**
```bash
# Start Claude Code with the plugin
claude --plugin-dir /path/to/conductor

# Type /conductor: to see available commands
/conductor:
```

You should see the 5 conductor commands listed.

### Production (via GitHub Marketplace)

Add the GitHub repository as a marketplace and install:

```bash
# Add this repository as a marketplace
/plugin marketplace add lackeyjb/claude-conductor

# Install the plugin
/plugin install conductor@claude-conductor
```

### Symlink Installation (Alternative)

```bash
# Create plugins directory if it doesn't exist
mkdir -p ~/.claude/plugins

# Symlink the conductor plugin
ln -s /path/to/conductor ~/.claude/plugins/conductor
```

## Commands

### `/conductor:setup`

Initialize Conductor environment for a project.

**Usage:**
```
/conductor:setup [brownfield|greenfield]
```

**Arguments:**
- `brownfield` - Skip detection, treat as existing project
- `greenfield` - Skip detection, treat as new project

**What it does:**
1. Detects project maturity (brownfield vs greenfield)
2. Creates `conductor/` directory with context files
3. Interactively generates `product.md`, `tech-stack.md`, `workflow.md`
4. Creates first track with specification and plan

**Example:**
```
> /conductor:setup

Existing project detected. I'll analyze it to understand the current state.
Found: package.json, src/, .git

What do you want to build? [describe your first feature]
```

---

### `/conductor:new-track`

Create a new feature, bug, or chore track.

**Usage:**
```
/conductor:new-track [description]
```

**Arguments:**
- `description` - Brief description of the work (optional, will prompt if not provided)

**What it does:**
1. Infers track type (feature/bug/chore) from description
2. Delegates to planner agent for interactive Q&A
3. Generates `spec.md` with requirements
4. Generates `plan.md` with TDD-structured tasks
5. Creates track directory and updates `tracks.md`

**Example:**
```
> /conductor:new-track Add user authentication with OAuth

Creating feature track...
I have some questions to clarify the requirements:
1. Which OAuth providers should be supported?
2. Should we include "remember me" functionality?
...
```

---

### `/conductor:implement`

Execute tasks following TDD workflow.

**Usage:**
```
/conductor:implement [<track-name>] [--all]
```

**Arguments:**
- `<track-name>` - Partial name to select specific track (optional, selects next incomplete)
- `--all` - Run all phases instead of one at a time

**What it does:**
1. Selects next incomplete track (or specified track)
2. **Single-phase mode (default)**: Shows interactive phase selection, implements one phase at a time
3. **All-phases mode (`--all`)**: Implements all remaining phases continuously
4. Delegates each task to implementer agent
5. Follows TDD cycle: Red → Green → Refactor
6. Creates atomic commits with git notes
7. Triggers phase verification at phase boundaries
8. Creates checkpoints with reviewer agent

**Examples:**
```
> /conductor:implement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PHASE SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Track: User Authentication

  [x] Phase 1: Setup                    [complete]
  [ ] Phase 2: Backend API              [in progress - 2/5 tasks]
  [ ] Phase 3: Frontend Integration     [pending]

  Which phase would you like to implement?

  A) Phase 2: Backend API (recommended)
  B) Phase 3: Frontend Integration
  C) All remaining phases
```

```
> /conductor:implement --all

Running all remaining phases for track 'User Authentication'.
Current task: Implement JWT validation

[RED] Writing failing test...
[GREEN] Implementing to pass...
[REFACTOR] Cleaning up...

Task complete. Commit: feat(auth): Implement JWT validation [a1b2c3d]
```

---

### `/conductor:status`

Display project progress report.

**Usage:**
```
/conductor:status
```

**What it does:**
1. Parses all tracks and plans
2. Calculates completion percentages
3. Identifies current focus (in-progress track/phase/task)
4. Lists any blockers
5. Shows next actions

**Example output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONDUCTOR STATUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CURRENT FOCUS
───────────────────────────────────────────────────
  Track: User Authentication
  Phase: Backend API [~]
  Task:  Implement JWT validation [~]

PROGRESS
───────────────────────────────────────────────────
  [████████████░░░░░░░░] 60%  (12/20 tasks)
```

---

### `/conductor:revert`

Git-aware rollback of tracks, phases, or tasks.

**Usage:**
```
/conductor:revert [track|phase|task] [name]
```

**Arguments:**
- `track <name>` - Revert entire track
- `phase <name>` - Revert specific phase
- `task <name>` - Revert specific task

**What it does:**
1. Identifies all commits associated with the target
2. Finds both implementation and plan update commits
3. Presents revert plan for confirmation
4. Executes `git revert` in correct order
5. Handles conflicts with user guidance
6. Updates plan.md status markers

**Example:**
```
> /conductor:revert phase "Backend API"

I have analyzed the git history. Here is the revert plan:

Commits to revert (newest first):
  1. b2c3d4e - conductor(plan): Complete 'Add rate limiting'
  2. a1b2c3d - feat(api): Add rate limiting to endpoints

Do you want to proceed? [Y/n]
```

## Configuration

### Workflow Customization

Edit `conductor/workflow.md` after setup to customize:

| Setting | Default | Description |
|---------|---------|-------------|
| Coverage Target | 80% | Minimum test coverage percentage |
| Commit Strategy | Per Task | When to commit (per-task or per-phase) |
| Git Notes | Enabled | Attach summaries to commits |
| Mobile Testing | If Applicable | Require mobile verification |

### Quality Gates

The workflow enforces these checks before task completion:

- All tests pass
- Code coverage meets target (>80%)
- Code follows style guides
- No linting errors
- Type safety enforced
- Documentation updated

### Code Styleguides

Language-specific style guides are provided in `templates/code-styleguides/`:

- TypeScript
- Python
- Go
- JavaScript
- HTML/CSS

During `/conductor:setup`, selected styleguides are copied to `conductor/code_styleguides/` based on your tech stack. The `code-styleguides` skill auto-activates when writing code, reading from your project's styleguide files.

## Project Structure

When initialized, Conductor creates:

```
your-project/
└── conductor/
    ├── product.md           # Product vision and goals
    ├── product-guidelines.md # Brand and design standards
    ├── tech-stack.md        # Technology choices
    ├── workflow.md          # Development methodology
    ├── setup_state.json     # Resume capability state
    ├── tracks.md            # Track overview
    └── tracks/
        └── <track_id>/
            ├── spec.md      # Requirements specification
            ├── plan.md      # Implementation plan
            └── metadata.json
```

## Troubleshooting

### Common Errors

**"Conductor is not set up"**
```
Run /conductor:setup first to initialize the conductor/ directory.
```

**"No tracks found"**
```
Run /conductor:new-track to create your first track.
```

**"You have uncommitted changes"**
```
Commit or stash your changes before running /conductor:revert.
```

### Prerequisites

Before using Conductor:

1. **Git repository**: Project must be a git repo (or `/conductor:setup` will init one)
2. **Claude Code**: Version with plugin support
3. **Test framework**: Project should have testing set up for TDD workflow

### Debug Mode

For verbose output showing hook execution:

```bash
claude --verbose --plugin-dir /path/to/conductor
```

Check hook execution logs:
```
~/.claude/debug/
```

### Resuming Interrupted Setup

If setup is interrupted, it can be resumed:

```bash
# Setup saves state in conductor/setup_state.json
# Re-running setup will offer to resume from last successful step
/conductor:setup
```

## Architecture

Conductor uses Claude Code's plugin system:

| Component | Purpose |
|-----------|---------|
| **Commands** (`/conductor:*`) | User-invoked actions |
| **Agents** | Specialized subagents (planner, implementer, reviewer) |
| **Skills** | Auto-discovered capabilities (TDD, styleguides, context) |
| **Hooks** | Event-driven automation (context loading, change tracking) |

## Documentation

See the `reference/` directory for detailed documentation:

- [Implementation Blueprint](reference/implementation-blueprint.md)
- [Plugin Architecture](reference/plugin-architecture.md)
- [Claude Code Mapping](reference/claude-code-mapping.md)
- [Conductor Analysis](reference/conductor-analysis.md)

## License

Apache-2.0
