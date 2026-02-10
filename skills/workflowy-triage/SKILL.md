# Workflowy Triage Skill

Triage Workflowy nodes by proposing locations based on triage rules.

## Invocation

```
/workflowy-triage <source-node-id> [rules-node-id]
```

- `<source-node-id>`: Required. The node ID containing child nodes to triage.
- `[rules-node-id]`: Optional. The node ID containing triage rules. If not provided, search for a node named "rules for triage" in the workspace.

## Workflow

### Phase 1: Propose Locations

For each child node under the source node (called "node to triage"):

1. **Read the triage rules** from the rules node
2. **Analyze the node to triage** - examine its name, note, and children
3. **Determine the best location** based on the rules
4. **Create a proposal structure**:

```
[source node]
├── [node name truncated to 40 chars](id) -> [target name]
│   ├── [node to triage] ← MOVED here
│   ├── target: [link to target location]
│   ├── reason: [explanation for this choice]
│   └── alternative targets: [link1], [link2]
├── [next node truncated](id) -> [target name]
│   ├── [next node to triage]
│   ├── target: [link]
│   ├── reason: [explanation]
│   └── alternative targets: [...]
...
```

The proposal node name format:
```
<a href="https://workflowy.com/#/[node-id]">[node name, max 40 chars]</a>([short-id]) -> <a href="https://workflowy.com/#/[target-id]">[target name]</a>
```

Child nodes:
- First child: the node to triage (moved here)
- `target:` link to the proposed target location
- `reason:` explanation of why this location fits
- `alternative targets:` comma-separated links to other valid locations

### Phase 2: User Review

The user will:
1. Review each proposal by clicking the target link to see the destination
2. Either accept the primary target or choose from alternative targets
3. Move the "node to triage" to their chosen location
4. Replace the node to triage with a link to where it was placed (for tracking)
5. Optionally delete the target/reason/alternative children or keep for reference
6. Signal completion by invoking the skill again with `--review`

### Phase 3: Review and Update Rules

When invoked with `--review`:

```
/workflowy-triage <source-node-id> --review
```

1. **Examine the user's choices** - which locations did they accept vs. reject?
2. **Identify patterns** - did the user consistently prefer certain locations over suggestions?
3. **Propose rule updates** - suggest additions or modifications to the triage rules
4. **Apply updates** - after user approval, update the rules node

## Implementation Steps

### Step 1: Get the Rules

```
1. If rules-node-id provided, use workflowy_get to fetch it
2. Otherwise, use workflowy_search to find "rules for triage"
3. Parse the rules into a structured format
```

### Step 2: Get Nodes to Triage

```
1. Use workflowy_get on source-node-id with depth 2
2. Extract the immediate children as "nodes to triage"
```

### Step 3: For Each Node to Triage

```
1. Analyze the node content (name, note, children names)
2. Match against rules to find candidate locations
3. Rank candidates by relevance
4. Select primary location and up to 2 alternatives
```

### Step 4: Create Proposal Structure

For each node to triage:

```
1. workflowy_create: Create proposal node under source with:
   - name: "[node name truncated to 40 chars](short-id) -> [target name]"
   - both node name and target name are links
   - position: at the current position of the node to triage

2. workflowy_move: Move the node to triage as first child of proposal node

3. workflowy_create: Create "target:" child with link to target location

4. workflowy_create: Create "reason:" child with explanation

5. If alternatives exist:
   workflowy_create: Create "alternative targets:" child with comma-separated links
```

### Step 5: Review Phase (when --review flag)

```
1. workflowy_get on source-node-id with depth 3
2. For each proposal node:
   - Check if node to triage was moved elsewhere or left in place
   - Record the user's choice
3. Analyze patterns in user choices vs. original suggestions
4. If patterns detected:
   - Propose new rules or rule modifications
   - After user approval, workflowy_update the rules node
```

## Example

### Input Structure

```
[inbox] ← source-node-id
├── science of achievement vs art of fulfillment
├── try get shit done plugin
└── John (meeting notes)
```

### After Phase 1

```
[inbox]
├── [science of achievement vs art of...](e87e) -> [remember, ponder, reflect]
│   ├── science of achievement vs art of fulfillment
│   ├── target: [remember, ponder, reflect](link)
│   ├── reason: philosophical reflection on life priorities
│   └── alternative targets: [fulfilled](link), [express goals](link)
├── [try get shit done plugin](8cce) -> [in the next 7 days]
│   ├── try get shit done plugin
│   ├── target: [in the next 7 days](link)
│   ├── reason: actionable task to try a productivity tool
│   └── alternative targets: [use skills](link)
└── [John](c19f) -> [care for, partner, invest]
    ├── John (meeting notes)
    ├── target: [care for, partner, invest](link)
    ├── reason: developing a business relationship
    └── alternative targets: [grow understanding](link), [partner](link)
```

### After User Review

User moved "John" under the alternative suggestion, deleted the primary. User accepted other suggestions.

### Phase 3 Output

```
Observed patterns:
- You moved "John" to "grow > grow understanding" instead of "reproduce > care for..."
- This suggests meeting notes should prioritize learning over relationship-building

Proposed rule update:
- Add: "Meeting notes about external companies → grow > grow understanding, experience"

Would you like me to add this rule?
```

## Rules Node Format

The rules node should contain children structured as:

```
[rules for triage]
├── find the deepest most applicable node under synthesize
├── before finalizing a location, always call workflowy_get on it to see its children
│   └── only stop when the node is a leaf or no children match the item's content
```

Each rule guides how to find the best location. The triage process should:
1. Start from broad categories and drill down
2. For each candidate location, fetch its children with `workflowy_get`
3. Check if any child is a better match for the item's content
4. Continue recursively until reaching a leaf node or no children match

## Error Handling

- If source node not found: Report error with the ID attempted
- If rules node not found: Offer to create a default rules node
- If target location not found: Skip that suggestion, log warning
- If move fails: Report which node failed and why

## Notes

- Always preserve the original node content when moving
- Never delete nodes without explicit user instruction
- The proposal nodes are temporary scaffolding - user should clean them up after triage
- Consider using workflowy mirrors if the user wants to keep nodes in multiple locations
