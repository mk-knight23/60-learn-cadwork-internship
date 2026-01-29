# Dependency Injection Patterns

## What I Learned

Dependency Injection (DI) in Angular is more than just "getting services." It's a **design pattern that enables loose coupling, testability, and flexible architecture**. During this internship, I learned how to leverage DI for more than just service injection.

## Core Patterns

### Pattern 1: inject() Function

The modern way to use DI in Angular:

```typescript
@Component({...})
export class DashboardComponent {
  // Modern approach - use inject()
  private projectService = inject(ProjectService);
  private settingsService = inject(SettingsService);
  private router = inject(Router);
  
  // Computed signals that depend on injected services
  projects = toSignal(this.projectService.getProjects(), { 
    initialValue: [] 
  });
}
```

**Why prefer `inject()` over constructor injection?**
- Works outside constructors (in functions, initialization)
- Cleaner, less boilerplate
- Better for inheritance
- Aligns with functional programming patterns

### Pattern 2: Injection Tokens for Configuration

```typescript
// config.tokens.ts
export interface AppConfig {
  apiUrl: string;
  version: string;
  features: {
    enableAnalytics: boolean;
    enableExperimental: boolean;
  };
}

// Create injection token with default
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  factory: () => ({
    apiUrl: 'https://api.cadwork.local',
    version: '2.0.0',
    features: {
      enableAnalytics: true,
      enableExperimental: false
    }
  })
});

// Provide custom value in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        apiUrl: environment.apiUrl,
        version: '2.0.0',
        features: environment.features
      }
    }
  ]
};

// Use in component or service
@Injectable()
export class ApiService {
  private config = inject(APP_CONFIG);
  
  getUrl(endpoint: string): string {
    return `${this.config.apiUrl}/${endpoint}`;
  }
}
```

### Pattern 3: Hierarchical Injection

```typescript
// Parent component provides service
@Component({
  selector: 'app-project-dashboard',
  providers: [ProjectStateService],  // New instance per component
  template: `
    <app-project-list />
    <app-project-details />
  `
})
export class ProjectDashboardComponent {
  // This instance is shared with all children
  state = inject(ProjectStateService);
}

// Child components share the parent's instance
@Component({...})
export class ProjectListComponent {
  state = inject(ProjectStateService);  // Same instance as parent
}

@Component({...})
export class ProjectDetailsComponent {
  state = inject(ProjectStateService);  // Same instance as parent
}
```

**Why hierarchical injection?**
- Scoped state management
- Component-specific services
- Memory cleanup when component destroys

### Pattern 4: Optional and Self Decorators

```typescript
@Component({...})
export class FormFieldComponent {
  // Try to get parent form, but don't fail if not found
  parentForm = inject(NgForm, { optional: true, skipSelf: true });
  
  // Only look at this component's injector
  selfContainedService = inject(SomeService, { self: true });
  
  // Try host component's injector
  hostService = inject(SomeService, { host: true });
}
```

### Pattern 5: Factory Providers

```typescript
// When you need to create a service with dynamic values
export const LOGGER_CONFIG = new InjectionToken<LoggerConfig>('logger.config');

export const loggerProvider: Provider = {
  provide: LoggerService,
  useFactory: () => {
    const config = inject(LOGGER_CONFIG);
    const platform = inject(PLATFORM_ID);
    
    // Create service with injected dependencies
    return new LoggerService(config, {
      isBrowser: isPlatformBrowser(platform)
    });
  }
};

// Alternative: deps array syntax
export const loggerProviderAlt: Provider = {
  provide: LoggerService,
  useFactory: (config: LoggerConfig, platform: object) => {
    return new LoggerService(config, {
      isBrowser: isPlatformBrowser(platform)
    });
  },
  deps: [LOGGER_CONFIG, PLATFORM_ID]
};
```

## Advanced Patterns

### Pattern 6: Multi-Providers (Plugin System)

```typescript
// Validator interface
export interface FormValidator {
  name: string;
  validate(value: unknown): boolean;
}

// Token for multiple validators
export const FORM_VALIDATORS = new InjectionToken<FormValidator[]>('form.validators');

// Register multiple validators
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: FORM_VALIDATORS, useValue: requiredValidator, multi: true },
    { provide: FORM_VALIDATORS, useValue: emailValidator, multi: true },
    { provide: FORM_VALIDATORS, useValue: minLengthValidator, multi: true }
  ]
};

// Use all validators
@Injectable()
export class FormValidationService {
  private validators = inject(FORM_VALIDATORS);  // Gets array of all
  
  validate(value: unknown): ValidationResult {
    const results = this.validators.map(v => ({
      name: v.name,
      valid: v.validate(value)
    }));
    
    return {
      valid: results.every(r => r.valid),
      results
    };
  }
}
```

### Pattern 7: Value Providers with Type Safety

```typescript
// types.ts
export const API_VERSIONS = ['v1', 'v2'] as const;
export type ApiVersion = typeof API_VERSIONS[number];

// token.ts
export const API_VERSION = new InjectionToken<ApiVersion>('api.version');

// provider.ts
export const apiVersionProvider: Provider = {
  provide: API_VERSION,
  useValue: 'v2' as ApiVersion  // Type-safe!
};
```

### Pattern 8: Environment-Based Providers

```typescript
// app.config.ts
import { Environment } from './environments/environment';

export const getAppConfig = (environment: Environment): ApplicationConfig => ({
  providers: [
    // Core providers (always included)
    provideRouter(routes),
    provideAnimations(),
    
    // Environment-specific providers
    environment.production ? productionProviders : developmentProviders,
    
    // Feature flags as injectable values
    { provide: ENABLE_ANALYTICS, useValue: environment.features.analytics },
    { provide: API_BASE_URL, useValue: environment.apiUrl }
  ]
});

// main.ts
import { getAppConfig } from './app/app.config';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, getAppConfig(environment));
```

## Real-World Example: Theming

```typescript
// Theme tokens
export const THEME_CONFIG = new InjectionToken<ThemeConfig>('theme.config');
export const CSS_VARIABLES = new InjectionToken<Record<string, string>>('css.vars');

// Theme service
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private config = inject(THEME_CONFIG);
  private cssVars = inject(CSS_VARIABLES);
  private platformId = inject(PLATFORM_ID);
  
  private _theme = signal<Theme>('light');
  readonly theme = this._theme.asReadonly();
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.applyTheme();
    }
  }
  
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.applyTheme();
  }
  
  private applyTheme(): void {
    const root = document.documentElement;
    Object.entries(this.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
}

// Provide in app
export const themeProvider: Provider = {
  provide: THEME_CONFIG,
  useValue: {
    defaultTheme: 'light',
    supportedThemes: ['light', 'dark', 'system']
  }
};

export const cssVarsProvider: Provider = {
  provide: CSS_VARIABLES,
  useValue: {
    '--cad-primary': '#2563EB',
    '--cad-gray-50': '#F8FAFC',
    '--cad-gray-900': '#0F172A'
  }
};
```

## Testing with DI

```typescript
describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        { provide: API_BASE_URL, useValue: 'https://test.api' },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should use test API URL', () => {
    service.getProjects().subscribe();
    
    const req = httpMock.expectOne('https://test.api/projects');
    expect(req.request.method).toBe('GET');
  });
});
```

## Key Takeaways

1. **Use `inject()`**: Prefer over constructor injection
2. **Injection Tokens**: Use for configuration and interfaces
3. **Hierarchical DI**: Scope services to components when needed
4. **Factory Providers**: For complex service creation
5. **Multi-Providers**: Build plugin/extension systems
6. **Testability**: DI makes testing straightforward

## Resources

- [Angular Dependency Injection](https://angular.dev/guide/di)
- [Hierarchical Injectors](https://angular.dev/guide/di/hierarchical-dependency-injection)
- [Dependency Injection in Action](https://angular.dev/guide/di/dependency-injection-context)
