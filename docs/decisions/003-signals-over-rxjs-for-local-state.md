# ADR 003: Use Signals for Local State, RxJS for Async Operations

## Status
Accepted

## Context
Angular Signals were introduced as a new reactivity primitive. We needed a strategy for when to use Signals vs. RxJS.

## Decision
We will use **Angular Signals** for:
- Component-level state
- UI state (toggles, selections, form values)
- Simple computed values
- Settings and preferences

We will use **RxJS** for:
- HTTP requests and async operations
- Event streams
- Complex data transformations
- Cross-component communication (when needed)

## Consequences

### Positive
- **Simplicity**: Signals have a simpler API than RxJS for basic reactivity
- **Performance**: Signals use fine-grained change detection
- **Learning Curve**: Easier for developers new to reactive programming
- **Debugging**: Synchronous execution makes debugging easier

### Negative
- **Two Mental Models**: Team must understand both Signals and RxJS
- **Interoperability**: Converting between Signals and Observables requires boilerplate
- **Ecosystem**: Some libraries still expect Observables

## Code Examples

### Signals (Good for this)

```typescript
// Component state
class LessonComponent {
  // Simple state
  selectedLesson = signal<Lesson | null>(null);
  
  // Computed state
  lessonProgress = computed(() => {
    const lesson = this.selectedLesson();
    if (!lesson) return 0;
    return (lesson.completedSections / lesson.totalSections) * 100;
  });
  
  // UI state
  isExpanded = signal(false);
  
  toggleExpanded() {
    this.isExpanded.update(v => !v);
  }
}
```

### RxJS (Good for this)

```typescript
// HTTP operations
class LessonService {
  private http = inject(HttpClient);
  
  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>('/api/lessons').pipe(
      retry(3),
      shareReplay(1)
    );
  }
}

// Converting RxJS to Signals
class LessonComponent {
  private lessonService = inject(LessonService);
  
  // Use toSignal for simple cases
  lessons = toSignal(this.lessonService.getLessons(), {
    initialValue: [] as Lesson[]
  });
}
```

## Hybrid Patterns

When we need both:

```typescript
class SearchComponent {
  private searchService = inject(SearchService);
  
  // Signal for UI state
  searchTerm = signal('');
  
  // RxJS for debounced search
  private searchSubject = new Subject<string>();
  
  searchResults = toSignal(
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.searchService.search(term))
    ),
    { initialValue: [] }
  );
  
  onSearch(term: string) {
    this.searchTerm.set(term);
    this.searchSubject.next(term);
  }
}
```

## Migration Path

Existing services like `SettingsService` and `StatsService` already use Signals. We'll:
1. Keep them as-is (they work well)
2. Use RxJS for any new HTTP-based services
3. Provide `toSignal` converters at component boundaries

## References
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [RxJS Interop with Signals](https://angular.dev/guide/signals/rxjs-interop)
