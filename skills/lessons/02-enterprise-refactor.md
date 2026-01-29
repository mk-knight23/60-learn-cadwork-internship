# Lesson 2: Enterprise Refactor

## What I Built

Transformed the initial dashboard into a professional enterprise learning system with proper documentation, architecture decisions, and a design system.

## Why This Refactor Was Necessary

The initial version was functional but lacked:
- Clear documentation of decisions
- Professional enterprise patterns
- Explanations of tradeoffs
- A cohesive design system

This refactor addresses those gaps.

## Major Changes

### 1. Added Architecture Decision Records (ADRs)

Created `/docs/decisions/` with documented decisions:
- Why Angular Material over custom components
- Why standalone components over NgModules
- Why signals over RxJS for local state
- Why file-based content over CMS

**Why ADRs?**
- Future developers (including me) understand the context
- Prevents revisiting decisions without context
- Shows professional engineering practices

### 2. Created a Design System

Created `/design-system/MASTER.md` with:
- Color palette with semantic naming
- Typography scale
- Layout patterns
- Component specifications
- Documented tradeoffs

**Intentional Quirk**: Asymmetrical sidebar spacing (24px left, 20px right)

**Why?** Creates subtle visual interest without being distracting.

### 3. Migrated to Angular Material

Replaced custom Tailwind components with Angular Material:

**Before**:
```html
<div class="glass-card p-8">
  <h3 class="text-2xl font-bold">{{ project.title }}</h3>
  <div class="h-2 bg-slate-100 rounded-full">
    <div class="h-full bg-cad-blue" [style.width.%]="project.progress"></div>
  </div>
</div>
```

**After**:
```html
<mat-card class="project-card">
  <mat-card-header>
    <mat-card-title>{{ project().title }}</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <mat-progress-bar mode="determinate" [value]="progress()"></mat-progress-bar>
  </mat-card-content>
</mat-card>
```

**Tradeoff**: Less visual uniqueness, but better accessibility and maintainability.

### 4. Added Proper Routing

Implemented feature-based routing:

```typescript
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component') },
      { path: 'projects', loadComponent: () => import('./projects/projects.component') },
      { path: 'lessons', loadComponent: () => import('./lessons/lessons.component') },
      { path: 'skills', loadComponent: () => import('./skills/skills.component') }
    ]
  }
];
```

### 5. Created Skills/Lessons Content Structure

Organized learning content:

```
skills/
├── fundamentals/
│   ├── components.md
│   ├── services.md
│   └── routing.md
├── patterns/
│   ├── state-management.md
│   └── dependency-injection.md
└── lessons/
    ├── 01-internship-setup.md
    └── 02-enterprise-refactor.md
```

## Technical Decisions Made

### Decision: Keep Existing Services

**Context**: The original services (Settings, Audio, Stats, Keyboard) were well-designed.

**Decision**: Keep them with minor updates for Angular Material integration.

**Why**:
- Already used signals appropriately
- Clean separation of concerns
- No need to fix what isn't broken

### Decision: Use CSS Custom Properties for Theming

**Context**: Needed consistent theming across Angular Material and custom components.

**Decision**: Define CSS custom properties, map to Angular Material theme.

```scss
// Custom properties
:root {
  --cad-primary: #2563EB;
  --cad-gray-50: #F8FAFC;
  --cad-gray-900: #0F172A;
}

// Angular Material theme mapping
$primary: mat.define-palette(mat.$blue-palette, 600);
$accent: mat.define-palette(mat.$indigo-palette, 500);
```

## What I Learned

### 1. The Value of Documentation

Writing ADRs forced me to articulate why I made decisions. This:
- Clarified my own thinking
- Created a reference for future decisions
- Demonstrated professional practices

### 2. Design Systems Take Time (But Save Time)

Creating the design system upfront took effort, but now:
- Adding new features is faster
- UI is consistent
- Decisions are documented

### 3. Enterprise UI Patterns

Learned common enterprise patterns:
- Card-based layouts for scannability
- Data tables for comparison
- Sidebar navigation for wayfinding
- Progress indicators for status

## Challenges Faced

### Challenge: Balancing Professional and Approachable

**Problem**: Enterprise UI can feel cold and intimidating.

**Solution**:
- Use warm language in documentation
- Include "Why" explanations
- Add personal reflections in lessons
- Keep the "human" element visible

### Challenge: Angular Material Customization

**Problem**: Angular Material components have specific styling requirements.

**Solution**:
- Use CSS custom properties for overrides
- Create wrapper components for project-specific behavior
- Accept some design constraints

```scss
// Customizing Material Card
.mat-mdc-card {
  --mdc-elevated-card-container-color: var(--cad-gray-50);
  border-radius: 12px;
}
```

## Code I'm Proud Of

The layout component that ties everything together:

```typescript
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <span class="logo">CW</span>
          <div>
            <h1 class="title">Cadwork</h1>
            <p class="subtitle">Internship Portal</p>
          </div>
        </div>
        
        <mat-nav-list>
          <a mat-list-item 
             *ngFor="let item of navItems"
             [routerLink]="item.route"
             routerLinkActive="active">
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content class="main-content">
        <mat-toolbar class="toolbar">
          <span>{{ pageTitle() }}</span>
          <button mat-icon-button (click)="openSettings()">
            <mat-icon>settings</mat-icon>
          </button>
        </mat-toolbar>
        
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class LayoutComponent {
  private settings = inject(SettingsService);
  private router = inject(Router);
  
  navItems = [
    { route: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { route: '/projects', label: 'Projects', icon: 'folder' },
    { route: '/lessons', label: 'Lessons', icon: 'school' },
    { route: '/skills', label: 'Skills', icon: 'psychology' }
  ];
  
  pageTitle = computed(() => {
    const url = this.router.url;
    const item = this.navItems.find(i => url.startsWith(i.route));
    return item?.label ?? 'Cadwork';
  });
  
  openSettings(): void {
    this.settings.toggleHelp();
  }
}
```

## Tradeoffs Documented

| Decision | Chosen | Rejected | Why |
|----------|--------|----------|-----|
| Component Library | Angular Material | Custom Tailwind | Accessibility, maintenance |
| State Management | Signals + Services | NgRx | Sufficient complexity |
| Content Storage | Markdown files | CMS | Version control, simplicity |
| Routing | Feature-based | Flat | Scalability, organization |

## What I Didn't Build

### 1. Full CMS Integration

**Why not**: Overkill for current needs. Markdown files suffice.

**When to reconsider**: If non-technical team members need to edit frequently.

### 2. Real-time Collaboration

**Why not**: Single-user internship project. No collaboration needed.

**When to reconsider**: If multiple interns use the platform simultaneously.

### 3. Backend API

**Why not**: Static content works for learning materials. Stats stored locally.

**When to reconsider**: If cross-device sync or persistence is needed.

## Metrics

- **Components created**: 12
- **Lines of documentation**: ~2000
- **ADR documents**: 4
- **Skills documented**: 5

## Next Steps

1. Add lesson detail view
2. Implement progress tracking
3. Create skill assessment quizzes
4. Add search across all content

---

*Lesson 2: The Enterprise Refactor*
*Date: January 2026*
