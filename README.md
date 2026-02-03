# Starter Kit: Cadwork Internship Simulation

> A professional Angular application simulating a real-world engineering internship — complete with task briefs, milestones, deliverables, and portfolio-ready outputs.

---

## 🎯 Purpose

This starter kit provides a **complete internship simulation framework** for aspiring engineers to:
- Practice real-world engineering workflows
- Build portfolio-ready deliverables
- Learn enterprise Angular patterns
- Document architectural decisions professionally

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Angular 21 |
| UI Components | Angular Material |
| Styling | SCSS with CSS Custom Properties |
| Icons | Lucide Angular |
| State | Angular Signals |
| Async | RxJS (where needed) |
| Database | IndexedDB (browser-based) |
| Utilities | date-fns |
| Content | Markdown files |

---

## 🏗️ Architecture

### Database Layer

The application uses IndexedDB for persistent client-side data storage:

```
src/app/core/
├── services/
│   └── database.service.ts     # IndexedDB wrapper, seeding
└── repositories/
    ├── user.repository.ts       # User & settings CRUD
    ├── task.repository.ts       # Task & project CRUD
    ├── time-entry.repository.ts # Time tracking
    └── notes.repository.ts      # Notes CRUD
```

### Data Models

- **Users**: Profile, role, authentication state
- **Settings**: Theme, notifications, work schedule preferences
- **Projects**: Title, description, status, priority, progress
- **Tasks**: Title, description, assignee, due dates, time tracking
- **Time Entries**: Start/end time, duration, task association
- **Notes**: Title, content, category, tags, pinning
- **Lessons**: Title, category, content, difficulty
- **Skills**: Name, category, proficiency level

### Feature Structure

```
src/app/features/
├── dashboard/       # Main overview with stats
├── projects/        # Project tracking
├── lessons/         # Learning content browser
├── skills/          # Skills explorer
├── settings/        # User preferences & profile
├── analytics/       # Progress visualization
├── time-log/        # Time tracking with timer
├── notes/           # Personal knowledge base
└── layout/          # Navigation shell
```

## 🚀 Live Deployments

- **GitHub Pages**: https://mk-knight23.github.io/60-starter-cadwork-internship/
- **Vercel**: https://60-starter-cadwork-internship.vercel.app
- **Netlify**: Coming Soon

---

## How to Run Locally

### Prerequisites
- Node.js 18.x or higher
- npm 10.x or higher

### Installation
```bash
git clone https://github.com/mk-knight23/60-starter-cadwork-internship.git
cd 60-starter-cadwork-internship
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

## 🎓 What This Starter Provides

This starter kit delivers a **complete internship simulation framework** with:

### Real-World Engineering Experience

- **Task Briefs System** - Structured assignments with requirements, acceptance criteria, and deliverables
- **Milestone Tracking** - Professional progress tracking with clear objectives and dependencies
- **Architecture Decision Records** - Document technical decisions like an engineering team
- **Code Review Process** - Professional PR templates and review rubrics
- **Deliverable Templates** - Portfolio-ready artifacts (PRs, ADRs, demos, case studies)

### Data Persistence & Database

- **IndexedDB Database Layer** - Browser-based persistent storage for all application data
- **Repository Pattern** - Clean data access with Type-safe repositories for Users, Tasks, Projects, Notes, Time Entries
- **Automatic Seeding** - Pre-populated with sample projects, tasks, lessons, and skills
- **Full CRUD Operations** - Create, read, update, delete for all entities

### New Features & Pages

- **Settings Page** - User profile management, theme switching (dark/light), work schedule configuration
- **Analytics Dashboard** - Visual progress tracking, time distribution charts, task status breakdown, productivity trends
- **Time Log** - Built-in timer for tracking work hours, manual time entry, weekly/monthly summaries
- **Notes System** - Personal notes with categories, tags, pinning, and search functionality
- **Enhanced Navigation** - New menu items for all features with improved layout

### Enterprise-Grade Development

- **Angular 21** with standalone components and signals
- **Angular Material** for WCAG 2.1 AA compliant UI components
- **State Management** with Signals and RxJS patterns
- **IndexedDB Integration** - Client-side database for data persistence
- **Professional Architecture** - Clean separation, feature modules, SOLID principles

### Career-Ready Outputs

- **Resume Bullet Points Generator** - Transform work into achievement statements
- **Project Case Studies** - Portfolio-ready project writeups
- **Demo Scripts** - Professional presentation outlines
- **Documentation Skills** - Technical writing and API documentation
- **Code Review Skills** - Giving and receiving professional feedback

### Professional Development

- **Task Management** - Real-world assignment tracking and estimation
- **Documentation Practices** - ADRs, runbooks, API docs, user guides
- **Quality Standards** - Rubrics for code, tests, and deliverables
- **Workflow Automation** - Scripts for portfolio generation and deployment

---

## 👥 Who Is This For?

### Primary Users

- **Students & Graduates**: Gain real-world engineering experience before your first job
- **Bootcamp Graduates**: Bridge the gap between bootcamp and enterprise development
- **Career Switchers**: Demonstrate workplace readiness with professional deliverables
- **Junior Developers**: Practice advanced patterns and enterprise workflows

### Secondary Users

- **Mentors & Educators**: Structured framework for internship programs
- **Hiring Managers**: See candidates' real-world project experience
- **Engineering Teams**: Onboarding framework for new graduates

---

## 🚀 How To Use This Starter

### Quick Start (30 Minutes)

1. **Clone and Install**: Get the code running locally
2. **Explore the Dashboard**: See project tracking and progress
3. **Read a Task Brief**: Understand the internship workflow
4. **Review an ADR**: See how decisions are documented
5. **Check Rubrics**: Understand quality standards

### Recommended Learning Path

#### Phase 1: Foundation (Weeks 1-2)
- Explore the dashboard and project tracking system
- Read the ADRs to understand architectural decisions
- Complete your first task brief using the template
- Set up your development workflow

#### Phase 2: Core Development (Weeks 3-6)
- Implement the validation pipeline (TASK-001)
- Practice PR workflow with the template
- Write your first ADR for a technical decision
- Build portfolio deliverables as you go

#### Phase 3: Advanced Features (Weeks 7-10)
- Implement advanced state management
- Write comprehensive tests
- Create documentation and demos
- Generate portfolio outputs

#### Phase 4: Portfolio & Career (Weeks 11-12)
- Polish your GitHub repository
- Generate resume bullet points
- Write project case studies
- Prepare for interviews

### Directory Guide

```
60-starter-cadwork-internship/
├── src/app/
│   ├── core/
│   │   ├── services/
│   │   │   └── database.service.ts      # IndexedDB wrapper & seeding
│   │   ├── repositories/
│   │   │   ├── user.repository.ts        # User & settings data access
│   │   │   ├── task.repository.ts        # Task & project data access
│   │   │   ├── time-entry.repository.ts  # Time tracking data access
│   │   │   └── notes.repository.ts       # Notes data access
│   │   └── services/
│   │       └── profile.service.ts        # User profile & settings state
│   └── features/
│       ├── dashboard/                     # Overview with stats
│       ├── projects/                      # Project tracking & details
│       ├── lessons/                       # Learning content browser
│       ├── skills/                        # Skills explorer
│       ├── settings/                      # User preferences & profile
│       ├── analytics/                     # Progress visualization
│       ├── time-log/                      # Time tracking with timer
│       ├── notes/                         # Personal knowledge base
│       └── layout/                        # Navigation shell
├── tasks/              # 📋 Task briefs and assignments
│   ├── README.md       #    Task brief system overview
│   └── *.md            #    Individual task assignments
├── templates/          # 📝 Deliverable templates
│   ├── pr-template.md  #    Pull request template
│   └── adr-template.md #    Architecture decision template
├── rubrics/            # 📊 Quality assessment rubrics
│   └── code-review-rubric.md
├── docs/
│   ├── milestones.md   # 🎯 Internship milestones tracking
│   └── decisions/      #    Architecture Decision Records
├── skills/             # 📚 Technical learning content
└── src/                # 💻 Angular application code
```

---

## 💼 Portfolio & Career Outcomes

This starter is designed to generate **portfolio-ready artifacts** that demonstrate your capabilities to employers.

### Portfolio Deliverables

By completing this internship simulation, you'll have:

#### Code Artifacts
- **Clean GitHub Repository**: Professional commit history, clear structure, comprehensive README
- **Working Application**: Deployed and accessible to employers
- **Test Coverage**: 80%+ coverage demonstrating quality practices
- **Documentation**: API docs, architecture diagrams, deployment guides

#### Writing Samples
- **Architecture Decision Records**: Demonstrate technical reasoning
- **Pull Requests**: Show code review and collaboration skills
- **Technical Documentation**: Prove communication abilities
- **Project Case Studies**: Portfolio-ready project descriptions

#### Demonstration Materials
- **Demo Video**: 5-10 minute walkthrough of your work
- **Screenshots**: Visual evidence of your accomplishments
- **Feature Highlights**: Bullet points of technical achievements
- **Live Demo**: Working deployment for employers to explore

### Resume Bullet Points

This internship simulation translates into resume-worthy achievements:

**Example**:
> "Built an automated CAD validation pipeline using Angular 21 and TypeScript, reducing manual review time by 80% and improving engineering team productivity by 15 hours/week. Implemented comprehensive testing achieving 85% code coverage, followed SOLID principles, and documented architectural decisions using ADR framework."

### Interview Talking Points

You'll have concrete examples for common interview questions:

**"Tell me about a challenging technical problem you solved"**:
→ Describe implementing the validation pipeline, handling large file processing, and optimizing performance

**"How do you approach architectural decisions?"**:
→ Reference your ADRs and the decision-making framework you used

**"How do you ensure code quality?"**:
→ Discuss your testing practices, code review participation, and adherence to rubrics

### Skills Demonstrated

- **Technical**: Angular, TypeScript, RxJS, testing, state management
- **Professional**: Documentation, code review, architectural thinking
- **Soft Skills**: Self-directed learning, time management, attention to detail
- **Enterprise Readiness**: ADRs, PR workflows, testing, deployment

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
60-starter-cadwork-internship/
├── skills/                    # Learning content (Markdown)
│   ├── fundamentals/          # Angular basics
│   ├── patterns/              # Design patterns
│   └── lessons/               # Internship journal
├── src/app/
│   ├── core/                  # Services, repositories, utilities
│   │   ├── services/
│   │   │   ├── database.service.ts      # IndexedDB layer
│   │   │   └── profile.service.ts        # User profile state
│   │   └── repositories/                 # Data access layer
│   ├── features/              # Feature modules
│   │   ├── dashboard/         # Main dashboard
│   │   ├── projects/          # Project tracking
│   │   ├── lessons/           # Lesson browser
│   │   ├── skills/            # Skills explorer
│   │   ├── settings/          # User settings
│   │   ├── analytics/         # Progress visualization
│   │   ├── time-log/          # Time tracking
│   │   └── notes/             # Notes system
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
