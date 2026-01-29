import { Component, inject, input, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

interface SkillItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  completed: boolean;
}

interface SkillCategoryData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  skills: SkillItem[];
}

@Component({
  selector: 'app-skill-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule
  ],
  template: `
    <div class="skill-category-container">
      <!-- Back Navigation -->
      <button mat-button class="back-button" (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        Back to Skills
      </button>

      @if (category(); as c) {
        <!-- Category Header -->
        <div class="category-header" [style.background-color]="c.color + '15'">
          <div class="header-icon" [style.background-color]="c.color + '30'">
            <mat-icon [style.color]="c.color">{{ c.icon }}</mat-icon>
          </div>
          <div class="header-content">
            <h1 class="category-title">{{ c.name }}</h1>
            <p class="category-description">{{ c.description }}</p>
          </div>
        </div>

        <!-- Skills List -->
        <div class="skills-list">
          @for (skill of c.skills; track skill.id) {
            <mat-card class="skill-item-card">
              <div class="skill-content">
                <div class="skill-status" [class.completed]="skill.completed">
                  <mat-icon>{{ skill.completed ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                </div>
                
                <div class="skill-info">
                  <div class="skill-header">
                    <h3 class="skill-title">{{ skill.title }}</h3>
                    <mat-chip-set>
                      <mat-chip [class]="'difficulty-' + skill.difficulty">
                        {{ skill.difficulty | titlecase }}
                      </mat-chip>
                      <mat-chip>
                        <mat-icon>schedule</mat-icon>
                        {{ skill.estimatedTime }}
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                  <p class="skill-description">{{ skill.description }}</p>
                </div>

                <div class="skill-action">
                  <a mat-stroked-button [routerLink]="getSkillLink(c.id, skill.id)">
                    {{ skill.completed ? 'Review' : 'Learn' }}
                    <mat-icon>arrow_forward</mat-icon>
                  </a>
                </div>
              </div>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .skill-category-container { max-width: 1000px; margin: 0 auto; }

    .back-button {
      margin-bottom: 24px;
      color: #64748B;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 32px;
      border-radius: 16px;
      margin-bottom: 32px;
    }

    .header-icon {
      width: 72px;
      height: 72px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .header-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .category-title {
      font-size: 32px;
      font-weight: 800;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .category-description {
      font-size: 16px;
      color: #64748B;
      margin: 0;
      line-height: 1.5;
    }

    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .skill-item-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      transition: all 0.2s ease;
    }

    .skill-item-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .skill-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px 24px;
    }

    .skill-status mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #CBD5E1;
    }

    .skill-status.completed mat-icon { color: #10B981; }

    .skill-info { flex: 1; }

    .skill-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .skill-title {
      font-size: 18px;
      font-weight: 700;
      color: #1E293B;
      margin: 0;
    }

    .skill-description {
      font-size: 14px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }

    .skill-action { flex-shrink: 0; }

    ::ng-deep .difficulty-beginner { background-color: #D1FAE5 !important; color: #059669 !important; }
    ::ng-deep .difficulty-intermediate { background-color: #DBEAFE !important; color: #2563EB !important; }
    ::ng-deep .difficulty-advanced { background-color: #FEF3C7 !important; color: #D97706 !important; }

    :host-context(.dark) {
      .category-title { color: #F8FAFC; }
      .category-description { color: #94A3B8; }
      .skill-item-card { background-color: #1E293B; border-color: #334155; }
      .skill-title { color: #F8FAFC; }
      .skill-description { color: #94A3B8; }
    }
  `]
})
export class SkillCategoryComponent {
  private location = inject(Location);
  categoryId = input<string>();

  category = signal<SkillCategoryData | null>({
    id: 'fundamentals',
    name: 'Angular Fundamentals',
    description: 'Core concepts that form the foundation of Angular development. These are the essential building blocks every Angular developer needs to master.',
    icon: 'code',
    color: '#2563EB',
    skills: [
      {
        id: 'components',
        title: 'Understanding Components',
        description: 'Learn the fundamentals of Angular component architecture, standalone components, lifecycle hooks, and best practices.',
        difficulty: 'beginner',
        estimatedTime: '45 min',
        completed: true
      },
      {
        id: 'services',
        title: 'Services & Dependency Injection',
        description: 'Deep dive into Angular services, the inject() function, hierarchical DI patterns, and testing services.',
        difficulty: 'intermediate',
        estimatedTime: '60 min',
        completed: true
      },
      {
        id: 'routing',
        title: 'Routing & Navigation',
        description: 'Implementing routing with lazy loading, resolvers, guards, and navigation patterns.',
        difficulty: 'intermediate',
        estimatedTime: '50 min',
        completed: false
      }
    ]
  });

  getSkillLink(categoryId: string, skillId: string): string {
    // For skills in the fundamentals category, they map to skills markdown files
    return `/skills/${categoryId}#${skillId}`;
  }

  goBack(): void {
    this.location.back();
  }
}
