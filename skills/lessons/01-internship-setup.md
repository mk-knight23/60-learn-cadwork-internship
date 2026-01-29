# Lesson 1: Internship Setup & First Decisions

## What I Built

The foundation of the Cadwork Internship Learning Portal—a professional dashboard for tracking projects and documenting learning.

## Technical Decisions Made

### Decision 1: Angular 19 + Standalone Components

**Context**: Starting a new project during an internship with modern Angular.

**Decision**: Use Angular 19 with standalone components, no NgModules.

**Why**:
- Eliminates boilerplate module files
- Simpler mental model for learning
- Future-proof architecture
- Better tree-shaking

**Code Example**:
```typescript
// Modern standalone component
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private projectService = inject(ProjectService);
  projects = toSignal(this.projectService.getProjects(), { initialValue: [] });
}
```

**Tradeoff Accepted**: Some team members needed to learn the new pattern. Documentation was essential.

---

### Decision 2: Tailwind CSS + Angular Material

**Context**: Need both rapid styling and professional components.

**Decision**: Use Tailwind for custom styling, Angular Material for complex components.

**Why**:
- Tailwind provides design system consistency
- Angular Material gives accessible, tested components
- Combination leverages strengths of both

**Tradeoff Accepted**: Two styling mental models; potential for inconsistency if not careful.

---

### Decision 3: File-Based Content

**Context**: Learning content (lessons, skills) needs to be documented.

**Decision**: Store content as Markdown files, not in a CMS or database.

**Why**:
- Content versioned with code
- No external dependencies
- Simple to update
- Review process via PR

**Tradeoff Accepted**: Non-technical stakeholders can't update content; requires redeploy for changes.

---

## Project Structure

```
src/app/
├── core/
│   ├── services/          # Settings, Audio, Stats, Keyboard
│   └── utils/             # Constants, helpers
├── features/
│   └── dashboard/         # Main dashboard feature
├── types/                 # TypeScript interfaces
└── app.component.ts       # Root component
```

## What I Learned

### 1. The Importance of Planning

Before writing code, I:
1. Defined the user journey
2. Sketched the layout
3. Listed required features
4. Chose the tech stack

This prevented major rewrites later.

### 2. Configuration Management

Created a centralized settings service early:

```typescript
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _theme = signal<Theme>('system');
  private _soundEnabled = signal(true);
  
  readonly theme = this._theme.asReadonly();
  readonly soundEnabled = this._soundEnabled.asReadonly();
  
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.saveToStorage();
  }
  
  toggleSound(): void {
    this._soundEnabled.update(v => !v);
  }
}
```

### 3. Keyboard Accessibility

Added keyboard shortcuts for power users:

```typescript
@Injectable({ providedIn: 'root' })
export class KeyboardService {
  private shortcuts = new Map<string, () => void>();
  
  registerShortcut(key: string, handler: () => void): void {
    this.shortcuts.set(key.toLowerCase(), handler);
  }
  
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      window.addEventListener('keydown', (e) => {
        const handler = this.shortcuts.get(e.key.toLowerCase());
        if (handler && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          handler();
        }
      });
    }
  }
}
```

## Challenges Faced

### Challenge 1: Dark Mode Implementation

**Problem**: Seamless dark mode switching without flash of wrong theme.

**Solution**: 
- Store preference in localStorage
- Apply class to `<html>` element
- Use CSS custom properties for colors

```typescript
applyTheme(): void {
  const isDark = this.theme() === 'dark' ||
    (this.theme() === 'system' && 
     window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  document.documentElement.classList.toggle('dark', isDark);
}
```

### Challenge 2: Audio Context Permissions

**Problem**: Browser autoplay policies block AudioContext initialization.

**Solution**:
- Initialize on first user interaction
- Graceful fallback if audio unavailable

```typescript
@Injectable({ providedIn: 'root' })
export class AudioService {
  private audioContext: AudioContext | null = null;
  private initialized = false;
  
  ensureInitialized(): void {
    if (!this.initialized && isPlatformBrowser(inject(PLATFORM_ID))) {
      this.audioContext = new AudioContext();
      this.initialized = true;
    }
  }
  
  playClick(): void {
    this.ensureInitialized();
    // ... play sound
  }
}
```

## Code I'm Proud Of

The stats tracking service—simple but effective:

```typescript
@Injectable({ providedIn: 'root' })
export class StatsService {
  private _projectsViewed = signal(0);
  private _tasksCompleted = signal(0);
  private _timeSpent = signal(0);
  
  recordProjectView(): void {
    this._projectsViewed.update(v => v + 1);
    this.save();
  }
  
  recordTaskComplete(): void {
    this._tasksCompleted.update(v => v + 1);
    this.save();
  }
  
  private save(): void {
    localStorage.setItem('stats', JSON.stringify({
      projects: this._projectsViewed(),
      tasks: this._tasksCompleted(),
      time: this._timeSpent()
    }));
  }
}
```

## Next Steps

1. Add lesson content management
2. Implement project detail views
3. Create skill tracking progress
4. Add search functionality

## Resources Used

- [Angular 19 Documentation](https://angular.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Angular Material](https://material.angular.io/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

*Lesson 1 of the Cadwork Internship Journey*
*Date: January 2026*
