import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { StatsService } from '../../core/services/stats.service';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'ongoing' | 'review' | 'completed';
  progress: number;
  startDate: string;
  category: string;
  tags: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="projects-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Projects</h1>
          <p class="page-subtitle">
            Manage and track internship project deliverables
          </p>
        </div>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          New Project
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput 
                 placeholder="Search projects..." 
                 [(ngModel)]="searchQuery"
                 (ngModelChange)="updateFilters()">
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (selectionChange)="updateFilters()">
            <mat-option value="">All Statuses</mat-option>
            <mat-option value="draft">Draft</mat-option>
            <mat-option value="ongoing">Ongoing</mat-option>
            <mat-option value="review">Review</mat-option>
            <mat-option value="completed">Completed</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="categoryFilter" (selectionChange)="updateFilters()">
            <mat-option value="">All Categories</mat-option>
            <mat-option value="Engineering">Engineering</mat-option>
            <mat-option value="Software">Software</mat-option>
            <mat-option value="Documentation">Documentation</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Projects List -->
      <div class="projects-list">
        @for (project of filteredProjects(); track project.id) {
          <mat-card class="project-card">
            <div class="project-content">
              <div class="project-main">
                <div class="project-header-row">
                  <div class="project-identity">
                    <span class="project-number">{{ project.id }}</span>
                    <h3 class="project-title">{{ project.title }}</h3>
                  </div>
                  <mat-chip-set>
                    <mat-chip [class]="'status-' + project.status">
                      {{ project.status | titlecase }}
                    </mat-chip>
                  </mat-chip-set>
                </div>

                <p class="project-description">{{ project.description }}</p>

                <div class="project-meta">
                  <span class="meta-item">
                    <mat-icon>calendar_today</mat-icon>
                    {{ project.startDate }}
                  </span>
                  <span class="meta-item">
                    <mat-icon>folder</mat-icon>
                    {{ project.category }}
                  </span>
                </div>

                <div class="project-tags">
                  @for (tag of project.tags; track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>
              </div>

              <div class="project-sidebar">
                <div class="progress-circle" 
                     [style.--progress]="project.progress"
                     [class.complete]="project.progress === 100">
                  <span class="progress-text">{{ project.progress }}%</span>
                </div>

                <div class="project-actions">
                  <a mat-stroked-button 
                     [routerLink]="['/projects', project.id]"
                     (click)="recordView()">
                    View
                  </a>
                  <button mat-icon-button>
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </mat-card>
        }
      </div>

      <!-- Empty State -->
      @if (filteredProjects().length === 0) {
        <div class="empty-state">
          <mat-icon class="empty-icon">folder_open</mat-icon>
          <h3>No projects found</h3>
          <p>Try adjusting your filters or create a new project.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .projects-container { max-width: 1200px; margin: 0 auto; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
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

    .filters-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-field { flex: 1; min-width: 300px; }
    .filter-field { width: 180px; }

    .projects-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .project-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      transition: box-shadow 0.2s ease;
    }

    .project-card:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }

    .project-content {
      display: flex;
      padding: 24px;
      gap: 24px;
    }

    .project-main { flex: 1; }

    .project-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .project-identity { display: flex; flex-direction: column; gap: 4px; }

    .project-number {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #94A3B8;
      font-weight: 600;
    }

    .project-title {
      font-size: 20px;
      font-weight: 700;
      color: #1E293B;
      margin: 0;
    }

    .project-description {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }

    .project-meta {
      display: flex;
      gap: 24px;
      margin-bottom: 12px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #64748B;
    }

    .meta-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #94A3B8;
    }

    .project-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tag {
      font-size: 12px;
      padding: 4px 10px;
      background-color: #F1F5F9;
      color: #475569;
      border-radius: 4px;
      font-weight: 500;
    }

    .project-sidebar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      min-width: 100px;
    }

    .progress-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: conic-gradient(
        #2563EB calc(var(--progress) * 1%),
        #E2E8F0 calc(var(--progress) * 1%)
      );
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .progress-circle::before {
      content: '';
      position: absolute;
      width: 64px;
      height: 64px;
      background: white;
      border-radius: 50%;
    }

    .progress-circle.complete {
      background: conic-gradient(#10B981 100%, #10B981 100%);
    }

    .progress-text {
      position: relative;
      font-size: 16px;
      font-weight: 700;
      color: #1E293B;
    }

    .project-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    ::ng-deep .status-draft { background-color: #F1F5F9 !important; color: #64748B !important; }
    ::ng-deep .status-ongoing { background-color: #DBEAFE !important; color: #2563EB !important; }
    ::ng-deep .status-review { background-color: #FEF3C7 !important; color: #D97706 !important; }
    ::ng-deep .status-completed { background-color: #D1FAE5 !important; color: #059669 !important; }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      color: #64748B;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #CBD5E1;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      font-size: 14px;
      margin: 0;
    }

    :host-context(.dark) {
      .page-title { color: #F8FAFC; }
      .page-subtitle { color: #94A3B8; }
      .project-card { background-color: #1E293B; border-color: #334155; }
      .project-title { color: #F8FAFC; }
      .project-description { color: #94A3B8; }
      .tag { background-color: #334155; color: #CBD5E1; }
      .progress-circle::before { background-color: #1E293B; }
      .progress-text { color: #F8FAFC; }
    }
  `]
})
export class ProjectsComponent {
  private statsService = inject(StatsService);

  searchQuery = '';
  statusFilter = '';
  categoryFilter = '';

  projects = signal<Project[]>([
    {
      id: 'PRJ-001',
      title: 'Hydraulic System Blueprinting',
      description: 'Comprehensive CAD documentation for hydraulic systems including pressure analysis and flow diagrams. This project involves creating detailed technical drawings and specifications for industrial hydraulic machinery.',
      status: 'ongoing',
      progress: 65,
      startDate: 'Jan 15, 2026',
      category: 'Engineering',
      tags: ['CAD', 'Hydraulics', 'Documentation']
    },
    {
      id: 'PRJ-002',
      title: 'Automated CAD Validation Engine',
      description: 'Automated validation pipeline for CAD files ensuring compliance with engineering standards. Implements rule-based checking and generates validation reports.',
      status: 'review',
      progress: 92,
      startDate: 'Feb 02, 2026',
      category: 'Software',
      tags: ['Automation', 'Validation', 'TypeScript']
    },
    {
      id: 'PRJ-003',
      title: 'Turbine Optimization Report',
      description: 'Analysis and optimization report for industrial turbine performance metrics. Includes efficiency analysis and recommendations for improvement.',
      status: 'completed',
      progress: 100,
      startDate: 'Dec 10, 2025',
      category: 'Engineering',
      tags: ['Analysis', 'Turbines', 'Optimization']
    },
    {
      id: 'PRJ-004',
      title: 'Material Stress Simulation',
      description: 'Finite element analysis simulation for new composite materials under load. Validates material properties for high-stress applications.',
      status: 'draft',
      progress: 12,
      startDate: 'Feb 10, 2026',
      category: 'Engineering',
      tags: ['FEA', 'Materials', 'Simulation']
    },
    {
      id: 'PRJ-005',
      title: 'API Documentation Portal',
      description: 'Internal documentation portal for engineering APIs. Includes interactive examples and code samples for integration.',
      status: 'ongoing',
      progress: 45,
      startDate: 'Jan 28, 2026',
      category: 'Documentation',
      tags: ['API', 'Documentation', 'Angular']
    }
  ]);

  filteredProjects = computed(() => {
    return this.projects().filter(project => {
      const matchesSearch = !this.searchQuery || 
        project.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchesStatus = !this.statusFilter || project.status === this.statusFilter;
      const matchesCategory = !this.categoryFilter || project.category === this.categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  });

  updateFilters(): void {
    // Triggered by ngModel changes
  }

  recordView(): void {
    this.statsService.recordProjectView();
  }
}
