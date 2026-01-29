# ADR 004: Use File-Based Content Over CMS

## Status
Accepted

## Context
We needed to store and manage learning content (lessons, skills, projects). Options included a headless CMS, database, or file-based approach.

## Decision
We will store all learning content as Markdown files in the repository, processed at build time.

## Consequences

### Positive
- **Version Control**: Content changes have full git history
- **Offline Development**: Works without internet or external services
- **Review Process**: Content changes go through PR review
- **Simplicity**: No external dependencies or API keys
- **Speed**: No runtime API calls to fetch content
- **Transparency**: Content is visible and auditable

### Negative
- **Non-Technical Editors**: Requires git knowledge to update content
- **Build Time**: Content updates require rebuild and redeploy
- **Scalability**: Large content volumes could slow builds
- **Media Handling**: Images/assets need separate management

## Content Structure

```
skills/
├── fundamentals/
│   ├── components.md
│   ├── services.md
│   └── routing.md
├── patterns/
│   ├── dependency-injection.md
│   └── state-management.md
└── lessons/
    ├── lesson-01-getting-started.md
    └── lesson-02-component-architecture.md
```

## Content Format

Each content file includes YAML frontmatter for metadata:

```markdown
---
title: Understanding Angular Components
description: Learn the fundamentals of Angular's component architecture
difficulty: beginner
duration: 30
order: 1
tags: ['components', 'fundamentals']
---

# Understanding Angular Components

Content here...
```

## Build-Time Processing

At build time, we:
1. Read all Markdown files
2. Parse frontmatter for metadata
3. Convert Markdown to HTML
4. Generate a content manifest
5. Include in the application bundle

## When This Won't Work

This approach may need reevaluation if:
- Content exceeds 1000 lessons (build performance)
- Non-technical team members need to edit frequently
- Real-time collaboration is needed
- Multi-language content becomes complex

## Tradeoff Acceptance

We're accepting that:
- Content updates require a developer
- Deployment is needed for content changes
- We can't A/B test content easily

For an internship learning portal, these are acceptable limitations.

## References
- [Front Matter](https://jekyllrb.com/docs/front-matter/)
- [Marked - Markdown Parser](https://marked.js.org/)
