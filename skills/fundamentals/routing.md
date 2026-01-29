# Angular Routing

## What I Learned

Routing in Angular is more than just URL matching—it's about **application architecture and user experience flow**. During this internship, I learned how to structure routes that reflect both the UI hierarchy and the mental model of users.

## Core Concepts

### Route Configuration

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Dashboard - Cadwork Internship'
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component')
          .then(m => m.ProjectsComponent),
        title: 'Projects - Cadwork Internship'
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/project-detail.component')
          .then(m => m.ProjectDetailComponent),
        resolve: {
          project: projectResolver
        }
      },
      {
        path: 'lessons',
        loadChildren: () => import('./features/lessons/lessons.routes')
          .then(m => m.lessonsRoutes)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];
```

### Lazy Loading Decision

**Decision**: Use `loadComponent` for top-level routes, `loadChildren` for feature areas.

**Why**:
- Faster initial load time
- Code splitting at logical boundaries
- Feature teams can work independently

**Tradeoff**: Slightly more complex mental model; need to understand chunking.

## Route Patterns I Used

### 1. Data Resolvers

```typescript
// project.resolver.ts
export const projectResolver: ResolveFn<Project> = (route) => {
  const projectService = inject(ProjectService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  
  if (!id) {
    return router.navigate(['/projects']);
  }
  
  return projectService.getProject(id).pipe(
    catchError(() => {
      // Project not found, redirect to list
      return router.navigate(['/projects']);
    })
  );
};
```

**Why Resolvers?**
- Component receives ready-to-use data
- No loading states needed in component
- Consistent error handling

**Tradeoff**: Blocks navigation until data loads; consider for fast endpoints only.

### 2. Route Guards

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl('/login');
};

// Usage in routes
{
  path: 'admin',
  canActivate: [authGuard],
  loadComponent: () => import('./admin/admin.component')
}
```

### 3. Nested Routes for Feature Organization

```typescript
// lessons.routes.ts
export const lessonsRoutes: Routes = [
  {
    path: '',
    component: LessonsLayoutComponent,
    children: [
      {
        path: '',
        component: LessonsListComponent
      },
      {
        path: ':category',
        component: LessonCategoryComponent,
        children: [
          {
            path: '',
            component: CategoryOverviewComponent
          },
          {
            path: ':lessonId',
            component: LessonDetailComponent
          }
        ]
      }
    ]
  }
];
```

URL structure:
- `/lessons` - List all lessons
- `/lessons/fundamentals` - Show fundamentals category
- `/lessons/fundamentals/components` - Show specific lesson

## Navigation Patterns

### 1. Programmatic Navigation

```typescript
@Component({...})
export class ProjectListComponent {
  private router = inject(Router);
  
  viewProject(project: Project): void {
    // Navigate with params
    this.router.navigate(['/projects', project.id]);
    
    // Or with query params
    this.router.navigate(['/projects'], {
      queryParams: { filter: 'active', sort: 'date' }
    });
  }
}
```

### 2. Reading Route Parameters

```typescript
@Component({...})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);
  
  // Using signals (modern approach)
  projectId = toSignal(
    this.route.paramMap.pipe(map(p => p.get('id'))),
    { initialValue: null }
  );
  
  // Or using async pipe in template
  project$ = this.route.data.pipe(map(d => d['project']));
}
```

### 3. Breadcrumb Implementation

```typescript
// breadcrumb.service.ts
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private router = inject(Router);
  
  breadcrumbs = computed(() => {
    const url = this.router.url;
    const segments = url.split('/').filter(Boolean);
    
    return segments.map((segment, index) => ({
      label: this.formatLabel(segment),
      url: '/' + segments.slice(0, index + 1).join('/')
    }));
  });
  
  private formatLabel(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
```

## Route Configuration Best Practices

### 1. Use `title` Property

```typescript
{
  path: 'lessons',
  loadComponent: () => import('./lessons.component'),
  title: 'Learning Center - Cadwork Internship'
}
```

**Why**: Automatically updates browser tab title; better UX and SEO.

### 2. Handle 404s Gracefully

```typescript
{
  path: '**',
  loadComponent: () => import('./not-found.component'),
  title: 'Page Not Found - Cadwork Internship'
}
```

Always place this last in the routes array.

### 3. Use Path Aliases for Clarity

```typescript
{
  path: '',
  pathMatch: 'full',  // Explicitly match full path
  redirectTo: 'dashboard'
}
```

## Mistakes I Made

### Mistake 1: Not Using Resolvers

**Before**:
```typescript
export class ProjectComponent {
  project: Project | null = null;
  loading = true;
  
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.service.getProject(id).subscribe(p => {
      this.project = p;
      this.loading = false;
    });
  }
}
```

**After**:
```typescript
export class ProjectComponent {
  project = input.required<Project>();  // From resolver
}
```

### Mistake 2: Subscribing to Route Params Manually

**Before**:
```typescript
ngOnInit() {
  this.route.params.subscribe(params => {
    this.loadProject(params['id']);
  });
}
```

**After**:
```typescript
// Using toSignal for automatic subscription management
projectId = toSignal(
  this.route.paramMap.pipe(map(p => p.get('id'))),
  { initialValue: null }
);

// Or in template with async pipe
// {{ (route.paramMap | async)?.get('id') }}
```

### Mistake 3: Not Handling Browser Back Button

Users pressing back after form submission would lose data. Solution:

```typescript
export class FormComponent {
  private location = inject(Location);
  
  cancel(): void {
    this.location.back();  // Properly handles history
  }
}
```

## Router Events for Analytics

```typescript
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  
  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe(event => {
        // Track page view
        console.log('Page view:', event.urlAfterRedirects);
      });
  }
}
```

## Key Takeaways

1. **Lazy Load by Feature**: Split routes at feature boundaries
2. **Use Resolvers**: For data that must be present before rendering
3. **Handle Errors**: Always have a 404 route
4. **Set Titles**: Every route should have a meaningful title
5. **Avoid Manual Subscriptions**: Use `toSignal` or async pipe
6. **Test Route Guards**: They're critical security components

## Resources

- [Angular Routing](https://angular.dev/guide/routing)
- [Route Guards](https://angular.dev/guide/routing/route-guards)
- [Lazy Loading](https://angular.dev/guide/routing/lazy-loading)
