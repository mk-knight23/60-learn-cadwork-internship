import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { StatsService } from '../../core/services/stats.service';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  completed: boolean;
  tags: string[];
}

interface LessonCategory {
  name: string;
  icon: string;
  description: string;
  lessons: Lesson[];
}

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatExpansionModule
  ],
  template: `
    <div class="lessons-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Learning Journal</h1>
          <p class="page-subtitle">
            Documented lessons from the Cadwork internship journey
          </p>
        </div>
        <div class="progress-summary">
          <div class="progress-info">
            <span class="progress-label">Overall Progress</span>
            <span class="progress-value">{{ overallProgress() }}%</span>
          </div>
          <mat-progress-bar mode="determinate" [value]="overallProgress()" class="overall-progress"></mat-progress-bar>
        </div>
      </div>

      <!-- Categories -->
      <div class="categories-list">
        @for (category of categories(); track category.name) {
          <mat-expansion-panel class="category-panel" expanded="true">
            <mat-expansion-panel-header class="category-header">
              <mat-panel-title class="category-title">
                <mat-icon class="category-icon">{{ category.icon }}</mat-icon>
                <div class="category-info">
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-description">{{ category.description }}</span>
                </div>
              </mat-panel-title>
              <mat-panel-description class="category-stats">
                {{ getCompletedCount(category) }} / {{ category.lessons.length }} completed
              </mat-panel-description>
            </mat-expansion-panel-header>

            <div class="lessons-grid">
              @for (lesson of category.lessons; track lesson.id) {
                <mat-card class="lesson-card" [class.completed]="lesson.completed">
                  <mat-card-header>
                    <div class="lesson-status" [class.completed]="lesson.completed">
                      <mat-icon>{{ lesson.completed ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    </div>
                    <mat-card-title>{{ lesson.title }}</mat-card-title>
                    <mat-card-subtitle>
                      <mat-chip-set>
                        <mat-chip [class]="'difficulty-' + lesson.difficulty">
                          {{ lesson.difficulty | titlecase }}
                        </mat-chip>
                        <mat-chip>{{ lesson.duration }}</mat-chip>
                      </mat-chip-set>
                    </mat-card-subtitle>
                  </mat-card-header>
                  
                  <mat-card-content>
                    <p class="lesson-description">{{ lesson.description }}</p>
                    <div class="lesson-tags">
                      @for (tag of lesson.tags; track tag) {
                        <span class="tag">{{ tag }}</span>
                      }
                    </div>
                  </mat-card-content>

                  <mat-card-actions align="end">
                    <a mat-button color="primary" [routerLink]="['/lessons', lesson.id]">
                      {{ lesson.completed ? 'Review' : 'Start Learning' }}
                      <mat-icon>{{ lesson.completed ? 'refresh' : 'arrow_forward' }}</mat-icon>
                    </a>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          </mat-expansion-panel>
        }
      </div>
    </div>
  `,
  styles: [`
    .lessons-container { max-width: 1200px; margin: 0 auto; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 24px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 800;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .page-subtitle {
      font-size: 16px;
      color: #64748B;
      margin: 0;
    }

    .progress-summary {
      background-color: white;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 20px 24px;
      min-width: 280px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .progress-label {
      font-size: 14px;
      font-weight: 600;
      color: #64748B;
    }

    .progress-value {
      font-size: 18px;
      font-weight: 800;
      color: #2563EB;
    }

    .overall-progress { border-radius: 4px; }

    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-panel {
      border-radius: 12px !important;
      border: 1px solid #E2E8F0;
      box-shadow: none !important;
    }

    .category-header { padding: 20px 24px; }

    .category-title {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .category-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .category-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .category-name {
      font-size: 18px;
      font-weight: 700;
      color: #1E293B;
    }

    .category-description {
      font-size: 13px;
      color: #64748B;
    }

    .category-stats {
      font-size: 14px;
      color: #64748B;
      font-weight: 600;
    }

    .lessons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
      padding: 8px 24px 24px;
    }

    .lesson-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      transition: all 0.2s ease;
    }

    .lesson-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .lesson-card.completed { border-color: #10B981; }

    .lesson-status {
      margin-bottom: 12px;
    }

    .lesson-status mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #CBD5E1;
    }

    .lesson-status.completed mat-icon { color: #10B981; }

    mat-card-title {
      font-size: 18px !important;
      font-weight: 700 !important;
      color: #1E293B;
      margin-bottom: 12px !important;
    }

    .lesson-description {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin: 16px 0;
    }

    .lesson-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .tag {
      font-size: 11px;
      padding: 4px 8px;
      background-color: #F1F5F9;
      color: #64748B;
      border-radius: 4px;
      font-weight: 500;
    }

    ::ng-deep .difficulty-beginner { background-color: #D1FAE5 !important; color: #059669 !important; }
    ::ng-deep .difficulty-intermediate { background-color: #DBEAFE !important; color: #2563EB !important; }
    ::ng-deep .difficulty-advanced { background-color: #FEF3C7 !important; color: #D97706 !important; }

    :host-context(.dark) {
      .page-title { color: #F8FAFC; }
      .page-subtitle { color: #94A3B8; }
      .progress-summary { background-color: #1E293B; border-color: #334155; }
      .category-panel { background-color: #1E293B; border-color: #334155; }
      .category-name { color: #F8FAFC; }
      .lesson-card { background-color: #1E293B; border-color: #334155; }
      mat-card-title { color: #F8FAFC !important; }
      .lesson-description { color: #94A3B8; }
      .tag { background-color: #334155; color: #CBD5E1; }
    }
  `]
})
export class LessonsComponent {
  private statsService = inject(StatsService);

  categories = signal<LessonCategory[]>([
    {
      name: 'Internship Journey',
      icon: 'hiking',
      description: 'Weekly progress and major milestones',
      lessons: [
        {
          id: '01-internship-setup',
          title: 'Internship Setup & First Decisions',
          description: 'Setting up the project, choosing the tech stack, and making initial architecture decisions.',
          duration: '30 min',
          difficulty: 'beginner',
          category: 'Internship Journey',
          completed: true,
          tags: ['Setup', 'Angular', 'Architecture']
        },
        {
          id: '02-enterprise-refactor',
          title: 'Enterprise Refactor',
          description: 'Transforming the initial dashboard into a professional enterprise learning system.',
          duration: '45 min',
          difficulty: 'intermediate',
          category: 'Internship Journey',
          completed: false,
          tags: ['Refactoring', 'Design System', 'Documentation']
        }
      ]
    },
    {
      name: 'Angular Fundamentals',
      icon: 'code',
      description: 'Core Angular concepts and patterns',
      lessons: [
        {
          id: 'components',
          title: 'Understanding Components',
          description: 'Learn the fundamentals of Angular component architecture, standalone components, and lifecycle hooks.',
          duration: '45 min',
          difficulty: 'beginner',
          category: 'Fundamentals',
          completed: true,
          tags: ['Components', 'Standalone', 'Lifecycle']
        },
        {
          id: 'services',
          title: 'Services & Dependency Injection',
          description: 'Deep dive into Angular services, inject() function, and hierarchical DI patterns.',
          duration: '60 min',
          difficulty: 'intermediate',
          category: 'Fundamentals',
          completed: true,
          tags: ['Services', 'DI', 'Patterns']
        },
        {
          id: 'routing',
          title: 'Routing & Navigation',
          description: 'Implementing routing, lazy loading, resolvers, and guards.',
          duration: '50 min',
          difficulty: 'intermediate',
          category: 'Fundamentals',
          completed: false,
          tags: ['Routing', 'Lazy Loading', 'Guards']
        }
      ]
    },
    {
      name: 'Advanced Patterns',
      icon: 'psychology',
      description: 'Enterprise patterns and best practices',
      lessons: [
        {
          id: 'state-management',
          title: 'State Management Patterns',
          description: 'Using Signals and RxJS for state management in Angular applications.',
          duration: '55 min',
          difficulty: 'advanced',
          category: 'Patterns',
          completed: true,
          tags: ['Signals', 'RxJS', 'State']
        },
        {
          id: 'dependency-injection',
          title: 'Advanced Dependency Injection',
          description: 'Factory providers, multi-providers, and hierarchical injection patterns.',
          duration: '45 min',
          difficulty: 'advanced',
          category: 'Patterns',
          completed: false,
          tags: ['DI', 'Providers', 'Testing']
        }
      ]
    }
  ]);

  overallProgress = signal(45); // Calculated percentage

  getCompletedCount(category: LessonCategory): number {
    return category.lessons.filter(l => l.completed).length;
  }
}
