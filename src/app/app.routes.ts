import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/layout/layout.component')
      .then(m => m.LayoutComponent),
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
        title: 'Project Details - Cadwork Internship'
      },
      {
        path: 'lessons',
        loadComponent: () => import('./features/lessons/lessons.component')
          .then(m => m.LessonsComponent),
        title: 'Lessons - Cadwork Internship'
      },
      {
        path: 'lessons/:id',
        loadComponent: () => import('./features/lessons/lesson-detail.component')
          .then(m => m.LessonDetailComponent),
        title: 'Lesson - Cadwork Internship'
      },
      {
        path: 'skills',
        loadComponent: () => import('./features/skills/skills.component')
          .then(m => m.SkillsComponent),
        title: 'Skills - Cadwork Internship'
      },
      {
        path: 'skills/:category',
        loadComponent: () => import('./features/skills/skill-category.component')
          .then(m => m.SkillCategoryComponent),
        title: 'Skill Category - Cadwork Internship'
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component')
          .then(m => m.SettingsComponent),
        title: 'Settings - Cadwork Internship'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component')
          .then(m => m.AnalyticsComponent),
        title: 'Analytics - Cadwork Internship'
      },
      {
        path: 'time-log',
        loadComponent: () => import('./features/time-log/time-log.component')
          .then(m => m.TimeLogComponent),
        title: 'Time Log - Cadwork Internship'
      },
      {
        path: 'notes',
        loadComponent: () => import('./features/notes/notes.component')
          .then(m => m.NotesComponent),
        title: 'Notes - Cadwork Internship'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found.component')
      .then(m => m.NotFoundComponent),
    title: 'Page Not Found - Cadwork Internship'
  }
];
