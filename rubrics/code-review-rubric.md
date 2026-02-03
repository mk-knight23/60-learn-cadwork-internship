# Code Review Rubric

Use this rubric to assess the quality, maintainability, and professionalism of code submissions.

---

## Scoring Guide

- **4 (Professional)**: Exceeds expectations, exemplary work
- **3 (Competent)**: Meets expectations, acceptable quality
- **2 (Developing)**: Needs improvement, requires revision
- **1 (Incomplete)**: Unacceptable, must be redone

---

## Criteria

### 1. Code Readability

**Score**: ___ / 4

**4 - Professional**:
- Code is self-documenting with clear intent
- Complex logic has explanatory comments
- Naming makes the code narrative
- No cognitive overhead to understand

**3 - Competent**:
- Variable/function names are clear
- Most code is self-explanatory
- Comments explain "why" not "what"
- Occasional unclear sections

**2 - Developing**:
- Some unclear naming conventions
- Comments explain obvious things
- Requires re-reading to understand
- Inconsistent naming patterns

**1 - Incomplete**:
- Cryptic abbreviations everywhere
- No comments for complex logic
- Named variables (`x`, `temp`, `data`)
- Impossible to follow

**Notes**:
_____________________________________________________________________
_____________________________________________________________________

---

### 2. Architecture & Design

**Score**: ___ / 4

**4 - Professional**:
- Clean separation of concerns
- Easy to test and modify
- Follows SOLID principles
- Appropriate design patterns
- Future-proof abstractions

**3 - Competent**:
- Generally good separation
- Mostly testable
- Mostly follows SOLID
- Suitable patterns used
- Some coupling issues

**2 - Developing**:
- Some mixing of concerns
- Difficult to test some parts
- Violates some SOLID principles
- Over-engineered or under-designed
- Tight coupling in places

**1 - Incomplete**:
- Everything in one place
- Untestable code
- No clear architecture
- Spaghetti code
- Highly coupled

**Notes**:
_____________________________________________________________________
_____________________________________________________________________

---

### 3. Error Handling

**Score**: ___ / 4

**4 - Professional**:
- Comprehensive error handling
- Meaningful error messages
- Graceful degradation
- Proper error logging
- User-friendly error displays

**3 - Competent**:
- Handles expected errors
- Descriptive error messages
- Basic logging
- Some edge cases missed

**2 - Developing**:
- Minimal error handling
- Generic error messages
- Little to no logging
- Crashes on edge cases

**1 - Incomplete**:
- No error handling
- Silent failures
- Console logs for errors
- Exposes stack traces to users

**Notes**:
_____________________________________________________________________
_____________________________________________________________________

---

### 4. Testing

**Score**: ___ / 4

**4 - Professional**:
- 90%+ code coverage
- Unit, integration, and E2E tests
- Tests are readable and maintainable
- Edge cases covered
- Tests document expected behavior

**3 - Competent**:
- 80%+ code coverage
- Good unit and integration tests
- Tests cover main scenarios
- Some edge cases missed

**2 - Developing**:
- 50-70% coverage
- Only unit tests
- Happy path only
- Brittle tests

**1 - Incomplete**:
- < 50% coverage
- No tests
- Broken tests
- Useless tests (always pass)

**Notes**:
_____________________________________________________________________
_____________________________________________________________________

---

### 5. Performance

**Score**: ___ / 4

**4 - Professional**:
- Optimized algorithms and data structures
- Efficient memory usage
- No unnecessary re-renders/computations
- Lazy loading where appropriate
- Performance metrics tracked

**3 - Competent**:
- Generally efficient code
- Reasonable memory usage
- No obvious performance issues
- Some optimization opportunities

**2 - Developing**:
- Inefficient algorithms
- Excessive memory usage
- Unnecessary computations
- No performance consideration

**1 - Incomplete**:
- O(n²) where O(n) possible
- Memory leaks
- Blocking operations
- Extremely slow

**Notes**:
_____________________________________________________________________
_____________________________________________________________________

---

### 6. Security

**Score**: ___ / 4

**4 - Professional**:
- Input validation on all inputs
- No hardcoded secrets
- Proper authentication/authorization
- Protection against common vulnerabilities
- Security best practices followed

**3 - Competent**:
- Most inputs validated
- Secrets in environment variables
- Basic auth implemented
- Generally secure

**2 - Developing**:
- Some validation missing
- Some secrets in code
- Auth gaps
- Potential vulnerabilities

**1 - Incomplete**:
- No input validation
- Hardcoded secrets
- No authentication
- SQL/XSS vulnerabilities
- Security disaster

**Notes**:
_____________________________________________________________________
_____________________________________________________________________

---

### 7. Type Safety (for TypeScript)

**Score**: ___ / 4

**4 - Professional**:
- Strict mode enabled
- No `any` types used
- Proper use of generics
- Type inference where appropriate
- Custom types for business logic

**3 - Competent**:
- Type checking enabled
- Minimal `any` usage
- Good type definitions
- Some type assertions

**2 - Developing**:
- Some `any` types
- Weak type definitions
- Overuse of type assertions
- Missing types

**1 - Incomplete**:
- JavaScript in TS files
- Mostly `any` types
- No type safety
- Type errors ignored

**Notes**:
_____________________________________________________________________
_____________________________________________________________________

---

### 8. Git Practices

**Score**: ___ / 4

**4 - Professional**:
- Clean commit history
- Meaningful commit messages
- Proper branch strategy
- No merge commits in feature branches
- Squashes related commits

**3 - Competent**:
- Good commit history
- Clear commit messages
- Appropriate branches
- Minor history issues

**2 - Developing**:
- Some messy commits
- Vague messages ("update", "fix")
- Branching confusion
- Merge commits in features

**1 - Incomplete**:
- One giant commit
- Messages like "asdf"
- No branching
- Force pushes used

**Notes**:
_____________________________________________________________________
_____________________________________________________________________

---

## Overall Assessment

### Total Score: ___ / 32 (___ %)

**Overall Quality Level**: ___ (Professional / Competent / Developing / Incomplete)

### Strengths

1. [Strength 1]
2. [Strength 2]
3. [Strength 3]

### Areas for Improvement

1. [Area 1] - Priority: High / Medium / Low
2. [Area 2] - Priority: High / Medium / Low
3. [Area 3] - Priority: High / Medium / Low

### Required Actions

- [ ] [Action 1]
- [ ] [Action 2]
- [ ] [Action 3]

### Revision Deadline

[Date for resubmission if score < 24/32]

---

## Reviewer Feedback

[Additional comments, suggestions, or praise]

_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

---

**Reviewer**: _________________
**Date**: _________________
**Approved**: ✅ / ❌ / 🔄 (Needs Revision)

---

*Code Review Rubric - Cadwork Internship Simulation*
