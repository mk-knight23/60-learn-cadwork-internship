# Workflow: Generate Task Brief

**Purpose**: Create a new task brief from a project requirement or feature request

**Inputs**:
- Feature description or requirement
- Priority level
- Target deadline

**Outputs**:
- Complete task brief document
- Linked to related milestones
- Ready for assignment

---

## Workflow Steps

### Step 1: Analyze Requirement

1. Read and understand the requirement
2. Identify key objectives
3. Determine functional and non-functional requirements
4. Estimate complexity and effort

### Step 2: Create Task Brief

1. Copy template: `/tasks/task-brief-template.md`
2. Fill in all required sections:
   - Overview and objectives
   - Requirements (functional/non-functional)
   - Acceptance criteria
   - Deliverables
   - Dependencies
   - Technical approach
   - Timeline and estimates

### Step 3: Link to Milestones

1. Identify relevant milestone(s) in `/docs/milestones.md`
2. Add task to milestone dependencies
3. Update milestone progress if needed

### Step 4: Quality Check

Verify the task brief:
- [ ] All sections completed
- [ ] Acceptance criteria are specific and measurable
- [ ] Deliverables are clearly defined
- [ ] Dependencies are identified
- [ ] Estimates are realistic
- [ ] Technical approach is sound

### Step 5: Save and Register

1. Save as `/tasks/TASK-XXX-[brief-title].md`
2. Update task index in `/tasks/README.md`
3. Notify stakeholders

---

## Example

**Input**:
```
Need to implement CAD file validation that checks engineering drawings
for compliance with company standards.
Priority: High
Deadline: Feb 15, 2026
```

**Output**: `/tasks/001-cad-validation-pipeline.md` (complete task brief)

---

## Automation

This workflow can be partially automated using Claude Code:

1. Provide requirement description
2. Ask Claude to "generate a task brief using the template"
3. Review and refine the generated brief
4. Save to `/tasks/` directory
