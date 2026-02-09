# workflowy-triage

A [Claude Code](https://claude.com/claude-code) skill that helps you triage Workflowy nodes by proposing locations based on rules you define. Claude analyzes each item, suggests where it should go, and learns from your decisions.

## Prerequisites

This skill requires the **Workflowy MCP server** to be configured in Claude Code. Install it first:

- [mholzen/workflowy](https://github.com/mholzen/workflowy) — follow the installation and MCP configuration instructions in that repo.

## Install

```bash
npx workflowy-triage
```

This copies the skill files into `~/.claude/skills/workflowy-triage/`.

## Usage

Inside a Claude Code session:

```
/workflowy-triage <node-id>
```

Where `<node-id>` is the Workflowy node containing items to triage. Claude will:

1. **Propose locations** for each child node based on your triage rules
2. Create a structured proposal with target, reason, and alternatives
3. Wait for you to review and move items to their final locations
4. **Learn from your choices** when you run `/workflowy-triage <node-id> --review`

## Triage Rules

Create a node called "rules for triage" in your Workflowy with patterns like:

```
rules for triage
├── AI/LLM insights → use agents
├── actionable tasks → plan > in the next 7 days
├── meeting notes → grow > grow understanding
├── business opportunities → create a business
└── philosophical insights → remember, ponder, reflect
```

Claude will match items against these patterns and propose appropriate locations.

## Uninstall

```bash
npx workflowy-triage uninstall
```
