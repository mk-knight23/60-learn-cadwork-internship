# Cadwork Internship Project Portal - Deployment Guide

A professional-grade engineering project management dashboard designed to track and document internship milestones and technical deliverables.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Local Development](#local-development)
4. [Testing](#testing)
5. [Deployment Options](#deployment-options)
6. [Production Considerations](#production-considerations)
7. [Feature Documentation](#feature-documentation)

## Project Overview

This portal serves as the centralized hub for the Cadwork internship, replacing legacy mobile-first scripts with a robust, data-driven web environment. It prioritizes clarity, technical precision, and architectural excellence.

### Key Features

- **Project Tracking**: Automated progress & milestone engine
- **Technical Dashboard**: Professional web interface
- **Dark Mode**: Sophisticated dark/light theme support
- **Domain-Driven Modular Structure**: Clean architecture

## Tech Stack

- **Framework**: Angular 21 (Standalone Components, Signals)
- **Styling**: Tailwind CSS (Blueprint palette)
- **Icons**: Lucide Angular
- **State**: Angular Signals for reactive UI state
- **Typography**: JetBrains Mono & Inter

## Local Development

### Prerequisites

- Node.js 18+ (LTS version recommended)
- npm 10+
- Angular CLI

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mk-knight23/60-starter-cadwork-internship.git
   cd 60-starter-cadwork-internship
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Open http://localhost:4200 in your browser.

### Development Workflow

```bash
# Development server
npm start

# Build for production
npm run build

# Watch mode for development
npm run watch

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Testing

### Test Setup

The project uses Angular testing with Karma and Jasmine:

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```
src/
├── app/
│   ├── features/projects/      # Project components
│   ├── types/                  # TypeScript interfaces
│   └── app.component.spec.ts   # App component tests
├── test-setup.ts              # Test configuration
└── tsconfig.spec.json         # Test TypeScript config
```

### Writing Tests

```typescript
// Example component test
describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Deployment Options

### 1. Vercel Deployment

#### Prerequisites
- Vercel account
- Vercel CLI

#### Steps
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   ```
   NODE_ENV=production
   API_URL=https://api.example.com
   ```

#### vercel.json
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/cadwork-project"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. GitHub Pages Deployment

#### Steps
1. **Update angular.json**
   ```json
   "budgets": [
     {
       "type": "initial",
       "maximumWarning": "2mb",
       "maximumError": "5mb"
     }
   ]
   ```

2. **Configure base URL**
   ```typescript
   // angular.json
   "architect": {
     "build": {
       "options": {
         "baseHref": "/60-starter-cadwork-internship/"
       }
     }
   }
   ```

3. **Build and deploy**
   ```bash
   npm run build
   ```

### 3. Docker Deployment

#### Build and Run
```bash
# Build image
docker build -t cadwork-internship .

# Run container
docker run -p 80:80 cadwork-internship

# Run with docker-compose
docker-compose up
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  cadwork-internship:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### 4. Traditional Web Server

#### Build the Application
```bash
npm run build
```

#### Serve with Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(?:css|js|ico|gif|jpe?g|png|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Production Considerations

### Performance Optimization

1. **Bundle Analysis**
   ```bash
   npm run build -- --stats-json
   # Use webpack-bundle-analyzer to analyze
   ```

2. **Lazy Loading**
   ```typescript
   // Routes configuration
   const routes: Routes = [
     {
       path: 'projects',
       loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule)
     }
   ];
   ```

3. **Image Optimization**
   - Use WebP format when supported
   - Implement lazy loading
   - Optimize asset sizes

### Security

1. **Content Security Policy**
   ```nginx
   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
   ```

2. **Environment Variables**
   ```bash
   # .env.production
   NODE_ENV=production
   API_URL=https://api.production.com
   DEBUG=false
   ```

3. **XSS Protection**
   - Angular's built-in XSS protection
   - Sanitize user input
   - Use DomSanitizer

### Monitoring and Analytics

1. **Error Tracking**
   ```typescript
   // Implement error boundary
   @Component({
     template: `<div *ngIf="error">{{ error }}</div>`
   })
   export class ErrorBoundaryComponent implements ErrorHandler {
     handleError(error: Error) {
       this.error = error.message;
       // Send to error tracking service
     }
   }
   ```

2. **Performance Monitoring**
   - Use Angular's built-in performance metrics
   - Implement custom performance tracking
   - Monitor bundle sizes and load times

### Caching Strategy

1. **Service Worker**
   ```typescript
   // Register service worker
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/ngsw-worker.js');
   }
   ```

2. **Browser Cache**
   - Cache static assets aggressively
   - Use cache-busting techniques
   - Implement proper cache headers

## Feature Documentation

### 1. Project Tracking System

#### Features
- Real-time progress updates
- Milestone tracking
- Deadline management
- Resource allocation

#### API Endpoints
```
GET    /api/projects         # List all projects
POST   /api/projects         # Create new project
GET    /api/projects/:id     # Get project details
PUT    /api/projects/:id     # Update project
DELETE /api/projects/:id     # Delete project
```

### 2. Dashboard Components

#### Main Dashboard
- Project overview cards
- Progress charts
- Recent activities
- Quick actions

#### Project Detail View
- Task list
- Team members
- Timeline
- Documents section

### 3. User Management

#### Features
- User profiles
- Role-based access control
- Authentication
- Preferences

#### User Types
- Intern
- Supervisor
- Admin
- Viewer

### 4. Reporting System

#### Report Types
- Weekly progress reports
- Milestone summaries
- Time tracking reports
- Performance analytics

## Development Best Practices

### Code Organization

```
src/
├── app/
│   ├── core/              # Core services
│   ├── features/          # Feature modules
│   │   ├── projects/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── projects.module.ts
│   ├── shared/            # Shared components
│   ├── types/            # TypeScript interfaces
│   └── app.module.ts     # Root module
└── assets/               # Static assets
```

### Naming Conventions

- Components: PascalCase (e.g., ProjectListComponent)
- Services: camelCase (e.g., projectService)
- Files: kebab-case (e.g., project-list.component.ts)
- CSS: BEM convention (e.g., project__card--active)

### Error Handling

```typescript
// Global error handler
@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error) {
    console.error('Global error:', error);
    // Send to error tracking service
  }
}
```

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version (use LTS)
   - Clear node_modules and reinstall
   - Update Angular CLI

2. **Runtime Errors**
   - Check browser console
   - Verify API endpoints
   - Check network requests

3. **Deployment Issues**
   - Verify build output
   - Check environment variables
   - Ensure proper permissions

### Debugging Techniques

1. **Development Mode**
   ```bash
   npm start -- --source-map
   ```

2. **Browser DevTools**
   - Network tab for API calls
   - Sources tab for debugging
   - Performance tab for optimization

3. **Angular DevTools**
   - Component tree inspection
   - State debugging
   - Performance profiling

## Contributing

### Development Workflow

1. Create feature branch
2. Implement features
3. Write tests
4. Run linting
5. Submit pull request

### Code Quality

- Follow Angular style guide
- Write tests for new features
- Update documentation
- Ensure accessibility

## Support

For deployment support:
1. Check troubleshooting section
2. Review GitHub issues
3. Create new issue with:
   - Deployment platform
   - Error messages
   - Environment details
   - Steps to reproduce

## License

MIT - Professional use permitted with attribution.

---

Built with Angular 21, TypeScript, and Tailwind CSS for optimal performance and developer experience.