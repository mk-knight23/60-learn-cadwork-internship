# Pull Request Template

> Use this template for all pull requests to ensure consistent, complete information for reviewers.

---

## PR-XXX: [Brief, descriptive title]

**Type**: 🎨 Feature | 🐛 Bug Fix | 🧹 Refactor | 📚 Documentation | ✨ Test | ⚡ Performance
**Size**: 🐢 Small | 🐇 Medium | 🦌 Large
**Priority**: 🔴 High | 🟡 Medium | 🟢 Low

---

## Summary

[Provide 2-3 sentence summary of what this PR does and why it matters.]

**Example**:
This PR implements the CAD validation pipeline that automatically checks engineering drawings for compliance with company standards. It reduces manual review time by 80% and prevents common errors from reaching production.

---

## Changes Made

### Added

- [Feature/component 1 - e.g., "ValidationService with 12 validation rules"]
- [Feature/component 2 - e.g., "ValidationReport component for displaying results"]
- [Feature/component 3 - e.g., "Unit tests achieving 80% coverage"]

### Changed

- [Modified component 1 - e.g., "FileUploadComponent now triggers validation"]
- [Modified component 2 - e.g., "Dashboard displays validation status"]

### Fixed

- [Bug fix 1 - e.g., "Fixed memory leak in parser for large files"]

### Removed

- [Removed item - e.g., "Deprecated validation helper functions"]

---

## Context & Motivation

**Problem**:
[Describe the problem this PR solves. What was broken, missing, or needing improvement?]

**Solution**:
[Describe how this PR addresses the problem. What approach was taken?]

**Impact**:
[Who benefits from this change? What value does it provide?]

**Example**:
**Problem**:
Manual CAD file review was taking 2-3 hours per drawing and missing common errors like incorrect layer naming or missing title blocks.

**Solution**:
Built an automated validation pipeline using a rules engine that checks files against 12+ compliance standards in under 5 seconds.

**Impact**:
Engineering team saves ~15 hours/week on review, error rate reduced by 60%, and onboarding time for new engineers reduced as standards are enforced automatically.

---

## Technical Approach

### Architecture

[Describe key architectural decisions and patterns used.]

**Example**:
We used a pipeline pattern with four stages:
1. **Parser**: Extract metadata from CAD files
2. **Rules Engine**: Apply validation rules in parallel
3. **Aggregator**: Combine and prioritize findings
4. **Reporter**: Generate JSON/PDF outputs

This allows easy addition of new rules without modifying the core pipeline.

### Trade-offs

[Describe trade-offs considered and why you made your choices.]

**Example**:
**Chose**: Rule-based validation over ML approach
**Why**: Faster implementation, more predictable, easier to audit, sufficient for current needs
**Trade-off**: Less flexible for edge cases, but we can add ML later as Phase 2

---

## Testing

### Test Coverage

- **Unit Tests**: [X]% coverage (target: 80%+)
- **Integration Tests**: [X] scenarios covered
- **E2E Tests**: [X] critical flows tested

### Manual Testing

- [ ] Tested on [browser/version]
- [ ] Verified accessibility with keyboard navigation
- [ ] Checked responsive design on mobile/tablet
- [ ] Validated performance with large files (50MB+)

### Test Evidence

[Link to test results or screenshots showing tests passing]

---

## Screenshots / Demo

### Before

[Screenshot or description of the state before this change]

### After

[Screenshot or description of the state after this change]

**Demo Video**: [Link to short demo video if applicable]

---

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed (I've reviewed my own code)
- [ ] Commented complex logic and non-obvious decisions
- [ ] Updated documentation (README, API docs, etc.)
- [ ] No console.log statements left in code
- [ ] No hardcoded values or secrets
- [ ] Added/updated tests for new functionality
- [ ] All tests passing locally
- [ ] Added/updated ADR if major architectural decision
- [ ] Accessibility verified (if UI changes)
- [ ] Performance tested (if applicable)

---

## Breaking Changes

[Describe any breaking changes to existing APIs, interfaces, or behavior. If none, state "None"]

**Example**:
Breaking: ValidationService interface changed - `validate()` now returns `ValidationResult` instead of `boolean`. Migration: Update all callers to handle result object.

---

## Migration Guide

[If breaking changes, provide clear migration instructions]

**Example**:
To migrate existing code:

```typescript
// Old
const isValid = await validationService.validate(file);

// New
const result = await validationService.validate(file);
if (result.isValid) {
  // Handle success
}
```

---

## Related Work

- **Issues**: Closes #[issue-number], Relates to #[issue-number]
- **PRs**: Depends on #[pr-number], Supersedes #[pr-number]
- **Docs**: [Link to documentation updates]
- **ADRs**: [Link to relevant Architecture Decision Records]

---

## Review Focus Areas

Please pay special attention to:

1. **[Area 1]**: [What to focus on - e.g., "Validation rule logic for edge cases"]
2. **[Area 2]**: [What to focus on - e.g., "Error handling in parser"]
3. **[Area 3]**: [What to focus on - e.g., "Performance with large files"]

---

## Questions & Discussion

[Any specific questions or points for discussion with reviewers]

**Example**:
- Q: Should we support .DWG format in addition to .DXF?
- Q: Is the 5-second performance target realistic for 50MB files?

---

## Deploy Notes

[Deployment instructions or considerations]

**Example**:
- Requires database migration for validation_rules table
- Feature flag: `ENABLE_CAD_VALIDATION=true` to enable
- No downtime required

---

## Post-Merge Tasks

- [ ] [Task 1 - e.g., "Update user documentation"]
- [ ] [Task 2 - e.g., "Present feature to team"]
- [ ] [Task 3 - e.g., "Monitor performance metrics"]

---

**Reviewer Notes**:
[Optional: Leave notes for specific reviewers if needed]

@reviewer1 - Please focus on validation logic
@reviewer2 - Please review UI/UX of results display

---

*Last Updated: [Date]*
