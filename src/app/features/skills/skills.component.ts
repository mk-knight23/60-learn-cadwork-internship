import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

interface SkillCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  skillCount: number;
  estimatedHours: number;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  template: `
    <div class="skills-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Skills</h1>
          <p class="page-subtitle">
            Angular concepts, patterns, and techniques learned during the internship
          </p>
        </div>
      </div>

      <!-- Skills Grid -->
      <div class="skills-grid">
        @for (category of categories(); track category.id) {
          <mat-card class="skill-card" [routerLink]="['/skills', category.id]">
            <div class="card-accent" [style.background-color]="category.color"></div>
            
            <mat-card-header>
              <div class="skill-icon" [style.background-color]="category.color + '20'">
                <mat-icon [style.color]="category.color">{{ category.icon }}</mat-icon>
              </div>
              <mat-card-title>{{ category.name }}</mat-card-title>
              <mat-card-subtitle>{{ category.description }}</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <div class="skill-stats">
                <div class="stat">
                  <span class="stat-value">{{ category.skillCount }}</span>
                  <span class="stat-label">Topics</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ category.estimatedHours }}h</span>
                  <span class="stat-label">Est. Time</span>
                </div>
              </div>
            </mat-card-content>

            <mat-card-actions align="end">
              <button mat-button color="primary">
                Explore
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>

      <!-- Skill Approach -->
      <mat-card class="approach-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>lightbulb</mat-icon>
          <mat-card-title>Learning Approach</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="approach-grid">
            <div class="approach-item">
              <mat-icon>code</mat-icon>
              <h4>Learn by Doing</h4>
              <p>Every skill includes practical code examples from real internship work.</p>
            </div>
            <div class="approach-item">
              <mat-icon>psychology</mat-icon>
              <h4>Understand Tradeoffs</h4>
              <p>Not just what to do, but why—and what alternatives were considered.</p>
            </div>
            <div class="approach-item">
              <mat-icon>history</mat-icon>
              <h4>Document Decisions</h4>
              <p>ADRs explain the context behind technical choices for future reference.</p>
            </div>
            <div class="approach-item">
              <mat-icon>school</mat-icon>
              <h4>Reflect & Share</h4>
              <p>Lessons learned are documented with mistakes, corrections, and insights.</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .skills-container { max-width: 1200px; margin: 0 auto; }

    .page-header {
      margin-bottom: 32px;
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

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .skill-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .skill-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .card-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .skill-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .skill-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    mat-card-title {
      font-size: 20px !important;
      font-weight: 700 !important;
      color: #1E293B;
    }

    mat-card-subtitle {
      font-size: 14px !important;
      color: #64748B !important;
      line-height: 1.5 !important;
    }

    .skill-stats {
      display: flex;
      gap: 24px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #F1F5F9;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: #1E293B;
    }

    .stat-label {
      font-size: 12px;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .approach-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
    }

    .approach-card mat-icon[mat-card-avatar] {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #F59E0B;
    }

    .approach-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      margin-top: 8px;
    }

    .approach-item {
      text-align: center;
      padding: 24px;
    }

    .approach-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #2563EB;
      margin-bottom: 16px;
    }

    .approach-item h4 {
      font-size: 16px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .approach-item p {
      font-size: 14px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }

    :host-context(.dark) {
      .page-title { color: #F8FAFC; }
      .page-subtitle { color: #94A3B8; }
      .skill-card, .approach-card { background-color: #1E293B; border-color: #334155; }
      mat-card-title { color: #F8FAFC !important; }
      .stat-value { color: #F8FAFC; }
      .approach-item h4 { color: #F8FAFC; }
      .approach-item p { color: #94A3B8; }
    }
  `]
})
export class SkillsComponent {
  categories = signal<SkillCategory[]>([
    {
      id: 'fundamentals',
      name: 'Angular Fundamentals',
      description: 'Core concepts: components, services, routing, and the foundation of Angular development.',
      icon: 'code',
      color: '#2563EB',
      skillCount: 3,
      estimatedHours: 4
    },
    {
      id: 'patterns',
      name: 'Design Patterns',
      description: 'Enterprise patterns: state management, dependency injection, and architectural approaches.',
      icon: 'psychology',
      color: '#8B5CF6',
      skillCount: 2,
      estimatedHours: 3
    },
    {
      id: 'lessons',
      name: 'Lessons Learned',
      description: 'Journal entries documenting decisions, mistakes, and insights from the internship.',
      icon: 'school',
      color: '#10B981',
      skillCount: 2,
      estimatedHours: 2
    }
  ]);
}
