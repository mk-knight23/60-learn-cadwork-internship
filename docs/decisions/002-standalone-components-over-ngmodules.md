# ADR 002: Use Standalone Components Over NgModules

## Status
Accepted

## Context
Angular 19 introduced significant improvements to standalone components. We needed to decide whether to use the traditional NgModule pattern or adopt standalone components for this project.

## Decision
We will use standalone components throughout the application. No feature modules will be created.

## Consequences

### Positive
- **Simpler Mental Model**: Components declare their own dependencies
- **Tree Shaking**: Better dead code elimination
- **Lazy Loading**: Easier route-level code splitting
- **Testing**: Simpler component isolation in tests
- **Future-Proof**: Aligns with Angular's direction

### Negative
- **Team Familiarity**: Some team members are more comfortable with NgModules
- **Library Integration**: Some older libraries expect module-based setup
- **Schematics**: Some Angular CLI schematics still generate module-based code

## Rationale

### Why Not NgModules?

In a learning portal context, we want the codebase to be as approachable as possible. NgModules add an abstraction layer that beginners struggle with:

```typescript
// Without NgModules - easier to understand
@Component({
  selector: 'app-lesson-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `...`
})
export class LessonCardComponent {}

// With NgModules - more indirection
@NgModule({
  declarations: [LessonCardComponent],
  imports: [MatCardModule, MatButtonModule],
  exports: [LessonCardComponent]
})
export class LessonCardModule {}
```

### File Structure Impact

```
# Standalone approach (what we use)
src/app/
├── features/
│   ├── lessons/
│   │   ├── lesson-list.component.ts
│   │   └── lesson-detail.component.ts
│   └── projects/
│       ├── project-list.component.ts
│       └── project-detail.component.ts

# NgModule approach (rejected)
src/app/
├── features/
│   ├── lessons/
│   │   ├── lessons.module.ts
│   │   ├── components/
│   │   │   ├── lesson-list.component.ts
│   │   │   └── lesson-detail.component.ts
│   │   └── lessons-routing.module.ts
```

## Implementation Pattern

Each feature component:
1. Is marked with `standalone: true`
2. Imports Angular Material modules directly
3. Imports shared components as needed
4. Declares its own routes (if applicable)

Example:
```typescript
@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    // Shared components
    LessonCardComponent
  ],
  template: `...`
})
export default class LessonsComponent {}
```

## Tradeoff Acceptance

We're accepting that:
- Some team members need to learn the standalone pattern
- We might encounter library integration issues (rare with modern libraries)
- We need to be vigilant about import duplication

## References
- [Angular Standalone Components Guide](https://angular.dev/guide/components/importing)
- [RFC: Standalone Components](https://github.com/angular/angular/discussions/43784)
