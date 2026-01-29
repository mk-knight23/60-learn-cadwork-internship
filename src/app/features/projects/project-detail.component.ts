import { Component, inject, input, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  status: 'draft' | 'ongoing' | 'review' | 'completed';
  progress: number;
  startDate: string;
  endDate?: string;
  category: string;
  tags: string[];
  milestones: Milestone[];
  decisions: Decision[];
  learnings: string[];
}

interface Milestone {
  title: string;
  date: string;
  completed: boolean;
}

interface Decision {
  title: string;
  context: string;
  decision: string;
  consequence: string;
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTabsModule,
    MatListModule
  ],
  template: `
    <div class="project-detail-container">
      <!-- Back Navigation -->
      <button mat-button class="back-button" (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        Back to Projects
      </button>

      @if (project(); as p) {
        <!-- Project Header -->
        <div class="project-header">
          <div class="header-main">
            <div class="project-id">{{ p.id }}</div>
            <h1 class="project-title">{{ p.title }}</h1>
            <mat-chip-set>
              <mat-chip [class]="'status-' + p.status">{{ p.status | titlecase }}</mat-chip>
              <mat-chip>{{ p.category }}</mat-chip>
            </mat-chip-set>
          </div>
          <div class="header-meta">
            <div class="progress-section">
              <span class="progress-label">{{ p.progress }}% Complete</span>
              <mat-progress-bar mode="determinate" [value]="p.progress"></mat-progress-bar>
            </div>
            <div class="date-range">
              <mat-icon>calendar_today</mat-icon>
              <span>{{ p.startDate }} - {{ p.endDate || 'Present' }}</span>
            </div>
          </div>
        </div>

        <!-- Content Tabs -->
        <mat-tab-group class="project-tabs">
          <!-- Overview Tab -->
          <mat-tab label="Overview">
            <div class="tab-content">
              <mat-card class="content-card">
                <mat-card-header>
                  <mat-card-title>Description</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p class="description-text">{{ p.longDescription }}</p>
                  
                  <h4 class="subsection-title">Tags</h4>
                  <div class="tags-list">
                    @for (tag of p.tags; track tag) {
                      <span class="tag">{{ tag }}</span>
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Milestones Tab -->
          <mat-tab label="Milestones">
            <div class="tab-content">
              <mat-card class="content-card">
                <mat-card-header>
                  <mat-card-title>Project Milestones</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <mat-list class="milestones-list">
                    @for (milestone of p.milestones; track milestone.title; let last = $last) {
                      <mat-list-item class="milestone-item">
                        <mat-icon matListItemIcon 
                                  [class.completed]="milestone.completed"
                                  [class.pending]="!milestone.completed">
                          {{ milestone.completed ? 'check_circle' : 'radio_button_unchecked' }}
                        </mat-icon>
                        <div matListItemTitle>{{ milestone.title }}</div>
                        <div matListItemLine>{{ milestone.date }}</div>
                      </mat-list-item>
                      @if (!last) {
                        <mat-divider></mat-divider>
                      }
                    }
                  </mat-list>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Decisions Tab -->
          <mat-tab label="Decisions">
            <div class="tab-content">
              @for (decision of p.decisions; track decision.title) {
                <mat-card class="decision-card">
                  <mat-card-header>
                    <mat-card-title>{{ decision.title }}</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="decision-section">
                      <h4>Context</h4>
                      <p>{{ decision.context }}</p>
                    </div>
                    <div class="decision-section">
                      <h4>Decision</h4>
                      <p class="decision-text">{{ decision.decision }}</p>
                    </div>
                    <div class="decision-section">
                      <h4>Consequence</h4>
                      <p>{{ decision.consequence }}</p>
                    </div>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          </mat-tab>

          <!-- Learnings Tab -->
          <mat-tab label="Learnings">
            <div class="tab-content">
              <mat-card class="content-card">
                <mat-card-header>
                  <mat-card-title>Key Learnings</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <ul class="learnings-list">
                    @for (learning of p.learnings; track learning) {
                      <li class="learning-item">
                        <mat-icon>school</mat-icon>
                        <span>{{ learning }}</span>
                      </li>
                    }
                  </ul>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      }
    </div>
  `,
  styles: [`
    .project-detail-container { max-width: 1000px; margin: 0 auto; }

    .back-button {
      margin-bottom: 24px;
      color: #64748B;
    }

    .project-header {
      background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 32px;
      color: white;
    }

    .project-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #94A3B8;
      margin-bottom: 8px;
    }

    .project-title {
      font-size: 32px;
      font-weight: 800;
      margin: 0 0 16px 0;
    }

    .header-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .progress-section {
      flex: 1;
      max-width: 300px;
    }

    .progress-label {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
      display: block;
    }

    .date-range {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #94A3B8;
    }

    .project-tabs { margin-top: 24px; }

    .tab-content { padding: 24px 0; }

    .content-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
    }

    .description-text {
      font-size: 16px;
      line-height: 1.7;
      color: #475569;
    }

    .subsection-title {
      font-size: 14px;
      font-weight: 600;
      color: #1E293B;
      margin: 24px 0 12px 0;
    }

    .tags-list {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tag {
      font-size: 12px;
      padding: 6px 12px;
      background-color: #F1F5F9;
      color: #475569;
      border-radius: 4px;
      font-weight: 500;
    }

    .milestones-list { padding: 0; }

    .milestone-item { height: auto; padding: 16px 0; }

    .milestone-item mat-icon.completed { color: #10B981; }
    .milestone-item mat-icon.pending { color: #94A3B8; }

    .decision-card {
      margin-bottom: 16px;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
    }

    .decision-section { margin-bottom: 16px; }
    .decision-section:last-child { margin-bottom: 0; }

    .decision-section h4 {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748B;
      margin: 0 0 8px 0;
    }

    .decision-section p {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }

    .decision-text {
      background-color: #EFF6FF;
      padding: 12px 16px;
      border-radius: 8px;
      border-left: 4px solid #2563EB;
    }

    .learnings-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .learning-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #F1F5F9;
    }

    .learning-item:last-child { border-bottom: none; }

    .learning-item mat-icon {
      color: #2563EB;
      font-size: 20px;
    }

    .learning-item span {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
    }

    ::ng-deep .status-draft { background-color: rgba(255,255,255,0.1) !important; color: white !important; }
    ::ng-deep .status-ongoing { background-color: rgba(37,99,235,0.3) !important; color: #93C5FD !important; }
    ::ng-deep .status-review { background-color: rgba(245,158,11,0.3) !important; color: #FCD34D !important; }
    ::ng-deep .status-completed { background-color: rgba(16,185,129,0.3) !important; color: #6EE7B7 !important; }

    :host-context(.dark) {
      .content-card, .decision-card { background-color: #1E293B; border-color: #334155; }
      .description-text { color: #94A3B8; }
      .subsection-title { color: #F8FAFC; }
      .tag { background-color: #334155; color: #CBD5E1; }
      .learning-item { border-color: #334155; }
      .learning-item span { color: #CBD5E1; }
      .decision-section p { color: #94A3B8; }
    }
  `]
})
export class ProjectDetailComponent {
  private location = inject(Location);
  id = input<string>();

  project = signal<ProjectDetail | null>({
    id: 'PRJ-001',
    title: 'Hydraulic System Blueprinting',
    description: 'Comprehensive CAD documentation for hydraulic systems.',
    longDescription: `This project involved creating comprehensive CAD documentation for industrial hydraulic systems. The work included pressure analysis diagrams, flow routing specifications, and component integration guides.

The documentation serves as the authoritative reference for maintenance teams and serves as training material for new engineers. All drawings follow ISO standards and include detailed BOM (Bill of Materials) specifications.`,
    status: 'ongoing',
    progress: 65,
    startDate: 'Jan 15, 2026',
    category: 'Engineering',
    tags: ['CAD', 'Hydraulics', 'Documentation', 'ISO Standards'],
    milestones: [
      { title: 'Initial Requirements Gathering', date: 'Jan 15, 2026', completed: true },
      { title: 'System Architecture Design', date: 'Jan 22, 2026', completed: true },
      { title: 'Component Documentation', date: 'Feb 05, 2026', completed: true },
      { title: 'Integration Diagrams', date: 'Feb 15, 2026', completed: false },
      { title: 'Final Review & Approval', date: 'Feb 28, 2026', completed: false }
    ],
    decisions: [
      {
        title: 'CAD Software Selection',
        context: 'Team needed to choose between AutoCAD and SolidWorks for the hydraulic documentation project.',
        decision: 'Selected SolidWorks for its superior 3D modeling capabilities and better integration with simulation tools.',
        consequence: 'Required team training on SolidWorks, but resulted in more accurate simulations and faster iteration cycles.'
      },
      {
        title: 'Documentation Format',
        context: 'Needed to decide between static PDF documentation and interactive web-based documentation.',
        decision: 'Implemented both: PDF for archival and print, interactive web version for daily use.',
        consequence: 'Doubled initial documentation effort, but significantly improved usability for different user types.'
      }
    ],
    learnings: [
      'Learned to create ISO-compliant technical drawings with proper dimensioning and tolerancing.',
      'Gained experience with SolidWorks PDM for version control of CAD files.',
      'Understood the importance of clear documentation for cross-team communication.',
      'Developed skills in translating engineering requirements into visual documentation.'
    ]
  });

  goBack(): void {
    this.location.back();
  }
}
