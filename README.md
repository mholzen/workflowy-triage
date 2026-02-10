# workflowy-triage

A skill that helps you triage Workflowy nodes by proposing locations based on
rules you define. Your agent analyzes each item, suggests where it should go,
and learns from your decisions.  Perfect for getting a handle on an overflowing
Inbox.

## Prerequisites

This skill requires the **Workflowy MCP server** to be configured in Claude
Code. Install it first:

- [mholzen/workflowy](https://github.com/mholzen/workflowy) — follow the
  installation and MCP configuration instructions in that repo.

## Install for Claude Code

```bash
npx workflowy-triage
```

This copies the skill files into `~/.claude/skills/workflowy-triage/`.

You can copy `~/.claude/skills/workflowy-triage/SKILL.md` to the skills folder
for other agents.

## Usage

Inside a Claude Code session:

```
/workflowy-triage <node-id> [rules-node-id]
```

- `<node-id>`: Required. The Workflowy node containing items to triage.
- `[rules-node-id]`: Optional. If not provided, searches for a node named "rules for triage".

## Workflow

### Phase 1: Propose Locations

For each child node, Claude:
1. Analyzes the node content (name, note, children)
2. Matches against your triage rules
3. Creates a proposal structure under the source node

Each proposal looks like:

```
[source node]
├── [node name](id) -> [target name]
│   ├── [original node] ← moved here
│   ├── target: [link to proposed location]
│   ├── reason: [why this location fits]
│   └── alternative targets: [other options]
```

### Phase 2: User Review

You review each proposal:
1. Click the target link to see the destination
2. Move the node to your chosen location (primary or alternative)
3. Clean up the proposal scaffolding

### Phase 3: Learn from Choices

Run `/workflowy-triage <node-id> --review` to:
1. Analyze which suggestions you accepted vs. rejected
2. Identify patterns in your preferences
3. Propose updates to your triage rules

## Triage Rules

Create a node called "rules for triage" in your Workflowy with rules like:

```
rules for triage
├── find the deepest most applicable node under synthesize
├── before finalizing a location, always call workflowy_get on it to see its children
│   └── only stop when the node is a leaf or no children match the item's content
```

Claude will start from broad categories and drill down recursively, fetching children at each level until finding the most specific matching location.

## Uninstall

```bash
npx workflowy-triage uninstall
```
