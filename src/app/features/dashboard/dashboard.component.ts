import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { StatsService } from '../../core/services/stats.service';
import { AudioService } from '../../core/services/audio.service';

interface DashboardStat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

interface ProjectPreview {
  id: string;
  title: string;
  status: 'draft' | 'ongoing' | 'review' | 'completed';
  progress: number;
  startDate: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
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
    <div class="dashboard-container">
      <!-- Stats Grid -->
      <section class="stats-section">
        <h2 class="section-title">Overview</h2>
        <div class="stats-grid">
          @for (stat of stats(); track stat.label) {
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-header">
                  <div class="stat-icon" [style.background-color]="stat.color + '20'">
                    <mat-icon [style.color]="stat.color">{{ stat.icon }}</mat-icon>
                  </div>
                </div>
                <div class="stat-content">
                  <p class="stat-label">{{ stat.label }}</p>
                  <p class="stat-value">{{ stat.value }}</p>
                  @if (stat.trend) {
                    <span class="stat-trend">{{ stat.trend }}</span>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </section>

      <!-- Projects Section -->
      <section class="projects-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Active Projects</h2>
            <p class="section-subtitle">
              Tracking internship deliverables and progress
            </p>
          </div>
          <a mat-stroked-button routerLink="/projects" color="primary">
            View All
            <mat-icon>arrow_forward</mat-icon>
          </a>
        </div>

        <div class="projects-grid">
          @for (project of projects(); track project.id) {
            <mat-card class="project-card">
              <mat-card-header>
                <div class="project-id">{{ project.id }}</div>
                <mat-card-title>{{ project.title }}</mat-card-title>
                <mat-card-subtitle>
                  <span class="project-date">{{ project.startDate }}</span>
                </mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <p class="project-description">{{ project.description }}</p>
                
                <div class="progress-section">
                  <div class="progress-header">
                    <span class="progress-label">Progress</span>
                    <span class="progress-value">{{ project.progress }}%</span>
                  </div>
                  <mat-progress-bar 
                    mode="determinate" 
                    [value]="project.progress"
                    [color]="getProgressColor(project.progress)">
                  </mat-progress-bar>
                </div>

                <mat-chip-listbox class="status-chips">
                  <mat-chip [class]="'status-' + project.status">
                    {{ project.status | titlecase }}
                  </mat-chip>
                </mat-chip-listbox>
              </mat-card-content>

              <mat-card-actions align="end">
                <button 
                  mat-button 
                  color="primary"
                  [routerLink]="['/projects', project.id]"
                  (click)="recordView()">
                  View Details
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      </section>

      <!-- Learning Progress Section -->
      <section class="learning-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Learning Progress</h2>
            <p class="section-subtitle">
              Skills and lessons completed during internship
            </p>
          </div>
          <a mat-stroked-button routerLink="/lessons" color="primary">
            Continue Learning
            <mat-icon>school</mat-icon>
          </a>
        </div>

        <div class="learning-grid">
          <mat-card class="learning-card">
            <mat-card-header>
              <mat-icon mat-card-avatar class="learning-icon">psychology</mat-icon>
              <mat-card-title>Fundamentals</mat-card-title>
              <mat-card-subtitle>Core Angular concepts</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="skill-list">
                <div class="skill-item completed">
                  <mat-icon>check_circle</mat-icon>
                  <span>Components</span>
                </div>
                <div class="skill-item completed">
                  <mat-icon>check_circle</mat-icon>
                  <span>Services</span>
                </div>
                <div class="skill-item in-progress">
                  <mat-icon>radio_button_unchecked</mat-icon>
                  <span>Routing</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="learning-card">
            <mat-card-header>
              <mat-icon mat-card-avatar class="learning-icon">pattern</mat-icon>
              <mat-card-title>Patterns</mat-card-title>
              <mat-card-subtitle>Advanced techniques</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="skill-list">
                <div class="skill-item completed">
                  <mat-icon>check_circle</mat-icon>
                  <span>State Management</span>
                </div>
                <div class="skill-item in-progress">
                  <mat-icon>radio_button_unchecked</mat-icon>
                  <span>Dependency Injection</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: #312E81;
      margin: 0 0 8px 0;
    }

    .section-subtitle {
      font-size: 14px;
      color: #6366F1;
      margin: 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    /* Stats Section */
    .stats-section { margin-bottom: 48px; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
      box-shadow: 0 8px 12px -2px rgba(79, 70, 229, 0.15), 0 4px 6px -2px rgba(79, 70, 229, 0.1);
      transform: translateY(-2px);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon { font-size: 24px; }

    .stat-content { margin-top: 8px; }

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6366F1;
      margin: 0 0 8px 0;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 800;
      color: #312E81;
      margin: 0;
    }

    .stat-trend {
      font-size: 12px;
      color: #22C55E;
      font-weight: 600;
    }

    /* Projects Section */
    .projects-section { margin-bottom: 48px; }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
    }

    .project-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06);
    }

    .project-card:hover {
      box-shadow: 0 8px 12px -2px rgba(79, 70, 229, 0.15), 0 4px 6px -2px rgba(79, 70, 229, 0.1);
      transform: translateY(-2px);
    }

    .project-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #818CF8;
      font-weight: 600;
      margin-bottom: 4px;
    }

    mat-card-title {
      font-size: 18px !important;
      font-weight: 700 !important;
      color: #312E81;
    }

    .project-date {
      font-size: 12px;
      color: #6366F1;
    }

    .project-description {
      font-size: 14px;
      color: #4F46E5;
      line-height: 1.5;
      margin: 16px 0;
    }

    .progress-section { margin: 16px 0; }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .progress-label {
      font-size: 12px;
      font-weight: 600;
      color: #6366F1;
      text-transform: uppercase;
    }

    .progress-value {
      font-size: 12px;
      font-weight: 700;
      color: #4F46E5;
    }

    .status-chips { margin-top: 16px; }

    ::ng-deep .status-draft { background-color: #E0E7FF !important; color: #6366F1 !important; }
    ::ng-deep .status-ongoing { background-color: #C7D2FE !important; color: #4F46E5 !important; }
    ::ng-deep .status-review { background-color: #FEF3C7 !important; color: #D97706 !important; }
    ::ng-deep .status-completed { background-color: #D1FAE5 !important; color: #22C55E !important; }

    /* Learning Section */
    .learning-section { margin-bottom: 48px; }

    .learning-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .learning-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .learning-card:hover {
      box-shadow: 0 8px 12px -2px rgba(79, 70, 229, 0.15), 0 4px 6px -2px rgba(79, 70, 229, 0.1);
      transform: translateY(-2px);
    }

    .learning-icon {
      color: #4F46E5;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .skill-list { margin-top: 16px; }

    .skill-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #C7D2FE;
      font-size: 14px;
      color: #4F46E5;
    }

    .skill-item:last-child { border-bottom: none; }

    .skill-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .skill-item.completed mat-icon { color: #22C55E; }
    .skill-item.in-progress mat-icon { color: #818CF8; }

    /* Dark Mode Support */
    :host-context(.dark) {
      .section-title { color: #E0E7FF; }
      .section-subtitle { color: #A5B4FC; }
      .stat-card, .project-card, .learning-card {
        background: rgba(30, 41, 59, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-color: rgba(129, 140, 248, 0.2);
      }
      .stat-value { color: #E0E7FF; }
      mat-card-title { color: #E0E7FF !important; }
      .project-description { color: #A5B4FC; }
      .skill-item { color: #C7D2FE; border-color: rgba(129, 140, 248, 0.2); }
      .progress-value { color: #818CF8; }
    }
  `]
})
export class DashboardComponent {
  private statsService = inject(StatsService);
  private audioService = inject(AudioService);

  stats = signal<DashboardStat[]>([
    { label: 'Active Projects', value: 12, icon: 'folder', color: '#4F46E5', trend: '+2 this month' },
    { label: 'Completed Tasks', value: 148, icon: 'check_circle', color: '#22C55E', trend: '+23 this week' },
    { label: 'Hours Logged', value: 640, icon: 'schedule', color: '#F59E0B' },
    { label: 'Lessons Learned', value: 24, icon: 'school', color: '#818CF8' }
  ]);

  projects = signal<ProjectPreview[]>([
    {
      id: 'PRJ-001',
      title: 'Hydraulic System Blueprinting',
      status: 'ongoing',
      progress: 65,
      startDate: 'Jan 15, 2026',
      description: 'Comprehensive CAD documentation for hydraulic systems including pressure analysis and flow diagrams.'
    },
    {
      id: 'PRJ-002',
      title: 'Automated CAD Validation Engine',
      status: 'review',
      progress: 92,
      startDate: 'Feb 02, 2026',
      description: 'Automated validation pipeline for CAD files ensuring compliance with engineering standards.'
    },
    {
      id: 'PRJ-003',
      title: 'Turbine Optimization Report',
      status: 'completed',
      progress: 100,
      startDate: 'Dec 10, 2025',
      description: 'Analysis and optimization report for industrial turbine performance metrics.'
    },
    {
      id: 'PRJ-004',
      title: 'Material Stress Simulation',
      status: 'draft',
      progress: 12,
      startDate: 'Feb 10, 2026',
      description: 'Finite element analysis simulation for new composite materials under load.'
    }
  ]);

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'accent';
    if (progress >= 50) return 'primary';
    return 'warn';
  }

  recordView(): void {
    this.statsService.recordProjectView();
    this.audioService.playClick();
  }
}
