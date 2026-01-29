# State Management Patterns

## What I Learned

State management doesn't always require Redux. During this internship, I learned to choose the right tool for the complexity of the state: **Signals for local, Services for shared, RxJS for async**.

## Decision Matrix

| Scenario | Solution | Why |
|----------|----------|-----|
| Component UI state | `signal()` | Simple, reactive, no boilerplate |
| Shared app state | Service + signals | Centralized, testable, framework-agnostic |
| Form state | Angular Forms | Built-in validation, dirty checking |
| Server state | RxJS + `toSignal` | Caching, error handling, loading states |
| Complex derived state | `computed()` | Automatic updates, memoization |

## Pattern 1: Service-Based State Management

### Simple Counter Example

```typescript
// counter.service.ts
@Injectable({ providedIn: 'root' })
export class CounterService {
  // Private writable signals
  private _count = signal(0);
  private _history = signal<number[]>([]);
  
  // Public readonly signals
  readonly count = this._count.asReadonly();
  readonly history = this._history.asReadonly();
  
  // Computed signals
  readonly isEven = computed(() => this._count() % 2 === 0);
  readonly doubleCount = computed(() => this._count() * 2);
  
  increment(): void {
    this._history.update(h => [...h, this._count()]);
    this._count.update(c => c + 1);
  }
  
  decrement(): void {
    this._history.update(h => [...h, this._count()]);
    this._count.update(c => c - 1);
  }
  
  reset(): void {
    this._history.set([]);
    this._count.set(0);
  }
}
```

### Component Usage

```typescript
@Component({
  selector: 'app-counter',
  template: `
    <div class="counter">
      <p>Count: {{ counterService.count() }}</p>
      <p>Double: {{ counterService.doubleCount() }}</p>
      <p>Is Even: {{ counterService.isEven() ? 'Yes' : 'No' }}</p>
      
      <button (click)="counterService.decrement()">-</button>
      <button (click)="counterService.increment()">+</button>
      <button (click)="counterService.reset()">Reset</button>
      
      <h4>History</h4>
      <ul>
        @for (value of counterService.history(); track $index) {
          <li>{{ value }}</li>
        }
      </ul>
    </div>
  `
})
export class CounterComponent {
  counterService = inject(CounterService);
}
```

## Pattern 2: Entity State (Lessons/Projects)

```typescript
// entity-store.service.ts (generic pattern)
interface EntityState<T> {
  entities: T[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

@Injectable()
export class EntityStore<T extends { id: string }> {
  private _state = signal<EntityState<T>>({
    entities: [],
    selectedId: null,
    loading: false,
    error: null
  });
  
  // Selectors
  readonly entities = computed(() => this._state().entities);
  readonly selectedId = computed(() => this._state().selectedId);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  
  readonly selectedEntity = computed(() => {
    const id = this.selectedId();
    return this.entities().find(e => e.id === id) ?? null;
  });
  
  readonly entityCount = computed(() => this.entities().length);
  
  // Actions
  setEntities(entities: T[]): void {
    this._state.update(s => ({ ...s, entities, loading: false }));
  }
  
  addEntity(entity: T): void {
    this._state.update(s => ({
      ...s,
      entities: [...s.entities, entity]
    }));
  }
  
  updateEntity(id: string, changes: Partial<T>): void {
    this._state.update(s => ({
      ...s,
      entities: s.entities.map(e =>
        e.id === id ? { ...e, ...changes } : e
      )
    }));
  }
  
  removeEntity(id: string): void {
    this._state.update(s => ({
      ...s,
      entities: s.entities.filter(e => e.id !== id)
    }));
  }
  
  select(id: string | null): void {
    this._state.update(s => ({ ...s, selectedId: id }));
  }
  
  setLoading(loading: boolean): void {
    this._state.update(s => ({ ...s, loading }));
  }
  
  setError(error: string | null): void {
    this._state.update(s => ({ ...s, error, loading: false }));
  }
}
```

## Pattern 3: Combining RxJS and Signals

```typescript
@Injectable({ providedIn: 'root' })
export class ProjectStore {
  private projectService = inject(ProjectService);
  
  // RxJS for async operations
  private refresh$ = new Subject<void>();
  
  // Server state as RxJS stream
  private projects$ = this.refresh$.pipe(
    startWith(null),
    switchMap(() => this.projectService.getProjects()),
    shareReplay(1)
  );
  
  // Convert to signals for the UI
  projects = toSignal(this.projects$, { initialValue: [] as Project[] });
  
  // Local UI state with signals
  private _filterText = signal('');
  private _sortBy = signal<'name' | 'date' | 'progress'>('date');
  
  readonly filterText = this._filterText.asReadonly();
  readonly sortBy = this._sortBy.asReadonly();
  
  // Derived state combining server + local
  filteredProjects = computed(() => {
    let projects = this.projects();
    const filter = this._filterText().toLowerCase();
    
    if (filter) {
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(filter) ||
        p.description.toLowerCase().includes(filter)
      );
    }
    
    return [...projects].sort((a, b) => {
      switch (this._sortBy()) {
        case 'name': return a.title.localeCompare(b.title);
        case 'date': return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'progress': return b.progress - a.progress;
        default: return 0;
      }
    });
  });
  
  // Actions
  setFilter(text: string): void {
    this._filterText.set(text);
  }
  
  setSortBy(sort: 'name' | 'date' | 'progress'): void {
    this._sortBy.set(sort);
  }
  
  refresh(): void {
    this.refresh$.next();
  }
}
```

## Pattern 4: Form State

```typescript
@Component({
  selector: 'app-project-form'
})
export class ProjectFormComponent {
  private fb = inject(FormBuilder);
  
  // Form state managed by Angular
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['draft' as ProjectStatus, Validators.required],
    startDate: ['', Validators.required],
    tags: this.fb.array([])
  });
  
  // Computed from form state
  isValid = computed(() => this.form.valid);
  hasChanges = computed(() => this.form.dirty);
  
  // Derived form values as signals
  formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.value
  });
  
  canSubmit = computed(() => 
    this.form.valid && this.form.dirty && !this.form.pending
  );
  
  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

## When to Use What

### Use Signals When:
- State is synchronous
- Updates are frequent
- Derived values need to update automatically
- You want fine-grained reactivity

### Use RxJS When:
- State comes from HTTP requests
- You need debouncing, throttling, or other stream operators
- Handling user input events
- Cross-component communication with events

### Use Angular Forms When:
- Managing form input state
- Need built-in validation
- Handling form submission lifecycle

## Common Pitfalls

### Pitfall 1: Mutating State Directly

```typescript
// WRONG: Mutates existing array
this.projects.update(projects => {
  projects.push(newProject);  // Mutation!
  return projects;
});

// CORRECT: Creates new array
this.projects.update(projects => [...projects, newProject]);
```

### Pitfall 2: Side Effects in Computed

```typescript
// WRONG: Side effect in computed
fullName = computed(() => {
  console.log('Computing...');  // Side effect!
  this.api.trackUsage();        // Side effect!
  return `${this.firstName()} ${this.lastName()}`;
});

// CORRECT: Pure computation
fullName = computed(() => 
  `${this.firstName()} ${this.lastName()}`
);

// Side effects in effect()
effect(() => {
  console.log('Name changed:', this.fullName());
});
```

### Pitfall 3: Not Cleaning Up Effects

```typescript
// In a component - needs cleanup
constructor() {
  // This will run even after component is destroyed!
  effect(() => {
    console.log(this.someSignal());
  });
}

// Better: Use untracked or manual cleanup
private destroyRef = inject(DestroyRef);

constructor() {
  const cleanup = effect(() => {
    console.log(this.someSignal());
  });
  
  this.destroyRef.onDestroy(cleanup);
}
```

## Key Takeaways

1. **Start Simple**: Use signals before reaching for complex libraries
2. **Separate Concerns**: Keep server state, local state, and derived state distinct
3. **Be Immutable**: Never mutate signals directly
4. **Pure Computations**: No side effects in `computed()`
5. **Clean Up**: Effects need cleanup in components

## Resources

- [Angular Signals](https://angular.dev/guide/signals)
- [RxJS Interop](https://angular.dev/guide/signals/rxjs-interop)
- [Component State Patterns](https://angular.dev/patterns)
