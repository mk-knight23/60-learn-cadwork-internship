# Workflow: Create Architecture Decision Record

**Purpose**: Document a significant architectural decision using ADR format

**When to Use**:
- Choosing between technology alternatives
- Making significant design decisions
- Establishing architectural patterns
- Documenting trade-offs and consequences

---

## Workflow Steps

### Step 1: Identify Decision Need

Ask yourself:
- Is this a significant technical decision?
- Will this impact the codebase for 6+ months?
- Are there multiple viable alternatives?
- Would future developers benefit from understanding this?

If yes to any, create an ADR.

### Step 2: Research Alternatives

1. Identify 2-4 viable alternatives
2. Research each option:
   - Pros and cons
   - Implementation complexity
   - Community support
   - Learning curve
   - Long-term viability

### Step 3: Create ADR

1. Copy template: `/templates/adr-template.md`
2. Fill in all sections:
   - **Context**: What problem led to this decision?
   - **Decision**: What did we decide?
   - **Consequences**: What are the positive and negative outcomes?
   - **Alternatives**: What did we consider and reject?
   - **Implementation**: How will we execute this decision?

### Step 4: Review and Validate

1. Self-review against ADR rubric
2. Get peer review
3. Discuss with mentor/senior engineer
4. Revise based on feedback

### Step 5: Record and Share

1. Save as `/docs/decisions/ADR-XXX-[title].md`
2. Update ADR index
3. Link related code/docs to ADR
4. Share with team

---

## Example ADRs

See `/docs/decisions/` for examples:
- `001-angular-material-over-custom.md`
- `002-standalone-components-over-ngmodules.md`
- `003-signals-over-rxjs-for-local-state.md`
- `004-file-based-content-over-cms.md`

---

## Quick Template

For small decisions, use this abbreviated format:

```markdown
# ADR-XXX: [Decision Title]

**Status**: Proposed | Accepted | Rejected
**Date**: [Date]

## Context
[2-3 sentences: What problem are we solving?]

## Decision
[1 sentence: What did we decide?]

## Why
[2-3 bullets: Key reasons for this decision]

## Trade-offs
- **Gained**: [benefit 1], [benefit 2]
- **Accepted**: [drawback 1], [drawback 2]

## Alternatives Considered
- [Alternative 1]: Rejected because [reason]
- [Alternative 2]: Rejected because [reason]
```

---

## Automation with Claude Code

To generate an ADR, use:

```
Please create an ADR for [decision topic].

Context: [describe the situation]
Options I'm considering:
1. [Option 1]
2. [Option 2]

Use the ADR template from /templates/adr-template.md
```

Claude will:
1. Research the options
2. Structure the ADR properly
3. Identify pros/cons of each alternative
4. Suggest a decision based on best practices

Review and refine the output before saving.
