# Cadwork Internship Learning Portal

> A professional Angular application documenting an internship journey through enterprise-grade code, architecture decisions, and documented learnings.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Angular 19 |
| UI Components | Angular Material |
| Styling | SCSS with CSS Custom Properties |
| Icons | Material Icons |
| State | Angular Signals |
| Async | RxJS (where needed) |
| Content | Markdown files |

---

## Live Links

- **GitHub Pages**: https://mk-knight23.github.io/60-learn-cadwork-internship/
- **Vercel**: https://60-learn-cadwork-internship.vercel.app
- **Netlify**: N/A

---

## How to Run Locally

### Prerequisites
- Node.js 18.x or higher
- npm 10.x or higher

### Installation
```bash
git clone https://github.com/mk-knight23/60-learn-cadwork-internship.git
cd 60-learn-cadwork-internship
npm install
```

### Development Server
```bash
npm start
```

Navigate to `http://localhost:4200/`

### Build
```bash
npm run build
```

---

## What Will I Learn?

This portal demonstrates real-world Angular development patterns learned during an internship at Cadwork Engineering:

- **Angular 19** with standalone components and signals
- **Enterprise UI patterns** using Angular Material
- **Architecture Decision Records** (ADRs) for documenting technical choices
- **State management** with Signals and RxJS
- **Professional component architecture** and design systems

Each lesson includes not just *what* was built, but *why* decisions were made and what tradeoffs were accepted.

---

## Who Is This For?

- **Junior developers** looking to see how real projects are structured
- **Students** learning Angular and enterprise patterns
- **Mentors** seeking examples of documented learning
- **Teams** wanting to understand ADR practices

---

## How Should I Go Through This?

### Suggested Path:

1. **Start with the Dashboard** - Get familiar with the UI and navigation
2. **Explore Projects** - See how engineering work is tracked and documented
3. **Read the Skills** - Deep dive into Angular concepts with code examples
4. **Review the Lessons** - Understand the internship journey and decisions made
5. **Check the ADRs** - See documented architecture decisions in `/docs/decisions/`

### Navigation:

- **Dashboard** - Overview of projects and learning progress
- **Projects** - Track internship deliverables with milestones and decisions
- **Lessons** - Journal entries documenting the learning journey
- **Skills** - Technical deep-dives into Angular concepts

---

## Why This Structure?

### Separating Skills from Lessons

**Skills** are technical deep-dives:
- Angular Components
- Services & DI
- Routing
- State Management

**Lessons** are narrative documentation:
- What was built
- Decisions made
- Tradeoffs accepted
- Mistakes made

This separation lets you find reference material quickly (Skills) or understand context (Lessons).

### Architecture Decision Records

Every major decision is documented in `/docs/decisions/` with:
- **Context** - What situation led to the decision
- **Decision** - What was decided
- **Consequences** - Both positive and negative outcomes
- **Alternatives** - What was considered and rejected

This practice, borrowed from enterprise architecture, ensures future developers (including the original author, months later) understand the "why" behind code.

---

## Design Notes

### Intentional Quirk: Asymmetrical Sidebar Spacing

The sidebar uses 24px padding on the left and 20px on the right. This is intentional.

**Why?** It creates a subtle "lean" that draws the eye toward navigation items. Symmetrical spacing felt too rigid; this adds character without being distracting.

### Tradeoff: Angular Material Over Custom Components

**We chose** Angular Material for our component library.

**We rejected** building custom Tailwind components.

**Why:** Accessibility compliance, maintenance burden, and alignment with enterprise standards matter more than visual uniqueness for an internal learning tool.

### Limitation Accepted: File-Based Content

Content is stored as Markdown files in the repository, not in a CMS.

**Limitation:** Non-technical team members cannot easily edit content.

**Why we accepted this:** For an internship project with primarily technical users, the benefits of version control, no external dependencies, and PR-based review outweigh this limitation.

### What We Didn't Build

1. **Real-time collaboration** - Not needed for a single-user internship journal
2. **Backend API** - Static content meets current needs
3. **Full-text search** - Would be valuable, deferred to future iteration
4. **User authentication** - Internal tool, no multi-user requirement

---

## Project Structure

```
60-learn-cadwork-internship/
├── skills/                    # Learning content (Markdown)
│   ├── fundamentals/          # Angular basics
│   ├── patterns/              # Design patterns
│   └── lessons/               # Internship journal
├── src/app/
│   ├── core/                  # Services, utilities
│   ├── features/              # Feature modules
│   │   ├── dashboard/         # Main dashboard
│   │   ├── projects/          # Project tracking
│   │   ├── lessons/           # Lesson browser
│   │   └── skills/            # Skills explorer
│   └── shared/                # Shared components
├── design-system/
│   └── MASTER.md              # Design system documentation
├── docs/decisions/            # Architecture Decision Records
└── README.md                  # This file
```

---

## Key Design Principles

1. **Explain the Why** - Every lesson includes context and tradeoffs
2. **Show Real Code** - Examples come from actual internship work
3. **Document Decisions** - ADRs preserve institutional knowledge
4. **Professional but Human** - Enterprise patterns with personal reflection
5. **Progressive Disclosure** - Overview first, details on demand

---

## Contributing

This is a personal internship documentation project, but the patterns and ADR format are freely reusable. If you find issues or have suggestions:

1. Check the existing ADRs to understand current decisions
2. Open an issue with context about your suggestion
3. Reference the Design System for UI changes

---

## License

MIT

---

## Acknowledgments

- Angular Team for the excellent framework and documentation
- Cadwork Engineering for the internship opportunity
- The enterprise architecture community for ADR practices

---

*Built with intention, documented with purpose.*
