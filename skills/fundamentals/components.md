# Angular Components

## What I Learned

Components are the fundamental building blocks of Angular applications. During my internship, I moved from understanding components as "UI pieces" to seeing them as **encapsulated units of behavior, presentation, and state**.

## Core Concepts

### Component Anatomy

```typescript
@Component({
  selector: 'app-project-card',           // HTML tag name
  standalone: true,                        // Modern Angular pattern
  imports: [CommonModule, MatCardModule],  // Dependencies
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // Performance optimization
})
export class ProjectCardComponent {
  // Inputs: Data flowing in
  @Input({ required: true }) project!: Project;
  
  // Outputs: Events flowing out
  @Output() select = new EventEmitter<Project>();
  
  // Local state
  isExpanded = signal(false);
  
  // Computed values
  progressPercent = computed(() => 
    Math.round((this.project.completed / this.project.total) * 100)
  );
}
```

### Key Decisions I Made

#### 1. Standalone vs. NgModule

**Decision**: Used standalone components exclusively.

**Why**: 
- Simpler mental model for new team members
- No need to maintain module files
- Better tree-shaking

**Tradeoff**: Lost the ability to group related components into feature modules for lazy loading boundaries.

#### 2. OnPush Change Detection

**Decision**: Applied `OnPush` to all presentational components.

**Why**:
- Significant performance improvement
- Forces immutable data patterns
- Makes data flow more predictable

**Tradeoff**: Had to ensure all inputs are immutable; required refactoring some services.

## Common Patterns

### Container/Presentational Pattern

```typescript
// Container: Handles data and logic
@Component({
  selector: 'app-project-list-container',
  template: `
    <app-project-list 
      [projects]="projects()"
      (select)="onSelect($event)" />
  `
})
export class ProjectListContainerComponent {
  private projectService = inject(ProjectService);
  projects = toSignal(this.projectService.getProjects(), { initialValue: [] });
}

// Presentational: Pure UI
@Component({
  selector: 'app-project-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class ProjectListComponent {
  @Input({ required: true }) projects!: Project[];
  @Output() select = new EventEmitter<Project>();
}
```

**Why this pattern?**
- Separates data fetching from presentation
- Presentational components are easier to test
- Enables component reuse

## Mistakes I Made

### Mistake 1: Too Many Responsibilities

**Before**:
```typescript
@Component({...})
export class DashboardComponent {
  // Data fetching
  // State management  
  // UI logic
  // Business logic
  // Event handling
}
```

**After**: Split into container + multiple presentational components.

### Mistake 2: Mutable State in Components

**Before**:
```typescript
export class FormComponent {
  formData = { name: '', email: '' };  // Mutable!
  
  updateName(name: string) {
    this.formData.name = name;  // Direct mutation
  }
}
```

**After**:
```typescript
export class FormComponent {
  formData = signal({ name: '', email: '' });  // Immutable
  
  updateName(name: string) {
    this.formData.update(data => ({ ...data, name }));  // New reference
  }
}
```

## Code Example from Internship

```typescript
// src/app/features/projects/components/project-card.component.ts
import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'cad-project-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-card class="project-card">
      <mat-card-header>
        <mat-card-title>{{ project().title }}</mat-card-title>
        <mat-card-subtitle>{{ project().id }}</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <p>{{ project().description }}</p>
        
        <div class="progress-section">
          <span class="progress-label">
            Progress: {{ progressPercent() }}%
          </span>
          <mat-progress-bar 
            mode="determinate" 
            [value]="progressPercent()" />
        </div>
      </mat-card-content>
      
      <mat-card-actions align="end">
        <button mat-button (click)="view.emit(project())">
          <mat-icon>visibility</mat-icon>
          View Details
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .project-card {
      margin-bottom: 16px;
    }
    .progress-section {
      margin-top: 16px;
    }
    .progress-label {
      font-size: 12px;
      color: var(--cad-gray-500);
    }
  `]
})
export class ProjectCardComponent {
  // Modern Angular input/output with signals
  project = input.required<Project>();
  view = output<Project>();
  
  progressPercent = computed(() => {
    const p = this.project();
    return Math.round((p.completedTasks / p.totalTasks) * 100);
  });
}
```

## Resources

- [Angular Components Guide](https://angular.dev/guide/components)
- [OnPush Change Detection Strategy](https://angular.dev/guide/change-detection)
- [Standalone Components](https://angular.dev/guide/components/importing)

## Self-Assessment

- [x] I can create a standalone component with proper inputs/outputs
- [x] I understand OnPush change detection and when to use it
- [x] I can separate container and presentational components
- [x] I use signals for component state
- [ ] I need more practice with component lifecycle hooks
