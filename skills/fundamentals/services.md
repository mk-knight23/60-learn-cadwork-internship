# Angular Services & Dependency Injection

## What I Learned

Services in Angular aren't just "helper classes"—they're the backbone of application architecture. Through this internship, I learned to think of services as **coordinators of business logic and state**.

## Core Concepts

### What Belongs in a Service?

| Belongs in Service | Belongs in Component |
|-------------------|----------------------|
| HTTP calls | UI event handlers |
| Business logic | View-specific state |
| Shared state | Component lifecycle |
| External API integration | Template logic |
| Data transformation | Presentation formatting |

### Dependency Injection Basics

```typescript
// Service definition
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.config.apiUrl}/projects`);
  }
}

// Component using the service
@Component({...})
export class ProjectListComponent {
  private projectService = inject(ProjectService);
  
  projects = toSignal(this.projectService.getProjects(), { 
    initialValue: [] 
  });
}
```

### Why `inject()` Over Constructor Injection?

**Decision**: Used the `inject()` function exclusively.

**Why**:
- More flexible (can use outside constructors)
- Cleaner code (no constructor boilerplate)
- Better for inheritance scenarios
- Aligns with modern Angular patterns

**Tradeoff**: Some developers find it less explicit than constructor injection.

## Service Patterns I Used

### 1. State Management Service with Signals

```typescript
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private platformId = inject(PLATFORM_ID);
  
  // Private writable signals
  private _theme = signal<Theme>('system');
  private _reducedMotion = signal(false);
  
  // Public readonly signals
  readonly theme = this._theme.asReadonly();
  readonly reducedMotion = this._reducedMotion.asReadonly();
  
  // Computed signal
  readonly isDarkMode = computed(() => {
    const theme = this._theme();
    if (theme !== 'system') return theme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  constructor() {
    // Load from localStorage on init
    if (isPlatformBrowser(this.platformId)) {
      this.loadSettings();
    }
  }
  
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.saveSettings();
  }
  
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('cadwork-settings');
      if (stored) {
        const data = JSON.parse(stored);
        this._theme.set(data.theme ?? 'system');
      }
    } catch {
      console.warn('Failed to load settings');
    }
  }
  
  private saveSettings(): void {
    localStorage.setItem('cadwork-settings', JSON.stringify({
      theme: this._theme()
    }));
  }
}
```

**Why Signals for State?**
- Fine-grained reactivity
- Automatic change detection
- Computed values are memoized
- Easier to debug than RxJS for simple state

### 2. API Service with Error Handling

```typescript
@Injectable({ providedIn: 'root' })
export class LessonService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandler);
  private config = inject(ConfigService);
  
  private readonly baseUrl = `${this.config.apiUrl}/lessons`;
  
  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.baseUrl).pipe(
      retry({ count: 3, delay: 1000 }),
      catchError(error => {
        this.errorHandler.handleError(error);
        return of([]);  // Return empty array on error
      }),
      shareReplay(1)  // Cache the result
    );
  }
  
  getLesson(id: string): Observable<Lesson | null> {
    return this.http.get<Lesson>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        }
        throw error;
      })
    );
  }
}
```

### 3. Stats Service (from actual project)

```typescript
@Injectable({ providedIn: 'root' })
export class StatsService {
  private platformId = inject(PLATFORM_ID);
  
  private _totalProjectsViewed = signal(0);
  private _totalTasksCompleted = signal(0);
  private _totalTimeSpent = signal(0);  // in seconds
  
  readonly totalProjectsViewed = this._totalProjectsViewed.asReadonly();
  readonly totalTasksCompleted = this._totalTasksCompleted.asReadonly();
  readonly totalTimeSpent = this._totalTimeSpent.asReadonly();
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }
  
  recordProjectView(): void {
    this._totalProjectsViewed.update(v => v + 1);
    this.saveToStorage();
  }
  
  recordTaskCompleted(): void {
    this._totalTasksCompleted.update(v => v + 1);
    this.saveToStorage();
  }
  
  addTimeSpent(seconds: number): void {
    this._totalTimeSpent.update(v => v + seconds);
    this.saveToStorage();
  }
  
  formatTime(): string {
    const seconds = this._totalTimeSpent();
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
  
  private loadFromStorage(): void {
    // Implementation...
  }
  
  private saveToStorage(): void {
    // Implementation...
  }
}
```

## DI Provider Patterns

### Value Providers

```typescript
// Providing configuration
export const API_CONFIG = new InjectionToken<ApiConfig>('api.config');

export const apiConfigProvider = {
  provide: API_CONFIG,
  useValue: {
    baseUrl: 'https://api.cadwork.local',
    version: 'v1',
    timeout: 30000
  }
};

// In app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    apiConfigProvider
  ]
};
```

### Factory Providers

```typescript
// When you need to compute the value
export const AUTH_CONFIG = new InjectionToken<AuthConfig>('auth.config');

export const authConfigProvider: Provider = {
  provide: AUTH_CONFIG,
  useFactory: () => {
    const isDev = !environment.production;
    return {
      clientId: isDev ? 'dev-client-id' : 'prod-client-id',
      redirectUri: `${window.location.origin}/callback`,
      scope: 'read write'
    };
  }
};
```

## Mistakes I Made

### Mistake 1: Services Doing Too Much

**Before**:
```typescript
@Injectable()
export class ProjectService {
  // HTTP calls
  // State management
  // Business logic
  // UI notifications
  // Error handling
  // Logging
}
```

**After**: Split into focused services:
- `ProjectApiService` - HTTP calls only
- `ProjectStateService` - State management
- `NotificationService` - UI notifications
- `ErrorHandler` - Centralized error handling

### Mistake 2: Not Using Injection Tokens for Configuration

**Before**:
```typescript
@Injectable()
export class ApiService {
  private baseUrl = 'https://api.example.com';  // Hardcoded!
}
```

**After**:
```typescript
export const API_BASE_URL = new InjectionToken<string>('api.baseUrl');

@Injectable()
export class ApiService {
  private baseUrl = inject(API_BASE_URL);
}
```

## Testing Services

```typescript
describe('SettingsService', () => {
  let service: SettingsService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // Mock PLATFORM_ID for browser environment
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(SettingsService);
  });
  
  it('should load default theme', () => {
    expect(service.theme()).toBe('system');
  });
  
  it('should update theme', () => {
    service.setTheme('dark');
    expect(service.theme()).toBe('dark');
  });
});
```

## Key Takeaways

1. **Single Responsibility**: Each service should do one thing well
2. **Signals for State**: Use signals for synchronous, component-shared state
3. **RxJS for Async**: Use RxJS for HTTP and event streams
4. **Injectable Everything**: If it has dependencies or holds state, make it a service
5. **Test in Isolation**: Services are easier to test than components

## Resources

- [Angular Dependency Injection](https://angular.dev/guide/di)
- [Services & DI](https://angular.dev/tutorials/learn-angular/injecting-dependency)
- [Injection Tokens](https://angular.dev/guide/di/dependency-injection-tokens)
