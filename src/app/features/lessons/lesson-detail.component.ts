import { Component, inject, input, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

interface LessonContent {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  tags: string[];
  whatWasBuilt: string;
  decisions: Decision[];
  tradeoffs: Tradeoff[];
  learnings: string[];
  codeHighlights: CodeHighlight[];
}

interface Decision {
  title: string;
  made: string;
  reason: string;
}

interface Tradeoff {
  title: string;
  chosen: string;
  rejected: string;
  why: string;
}

interface CodeHighlight {
  title: string;
  description: string;
  language: string;
}

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="lesson-detail-container">
      <!-- Back Navigation -->
      <button mat-button class="back-button" (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        Back to Lessons
      </button>

      @if (lesson(); as l) {
        <!-- Lesson Header -->
        <div class="lesson-header">
          <div class="header-content">
            <mat-chip-set class="lesson-meta">
              <mat-chip [class]="'difficulty-' + l.difficulty">
                {{ l.difficulty | titlecase }}
              </mat-chip>
              <mat-chip>
                <mat-icon>schedule</mat-icon>
                {{ l.duration }}
              </mat-chip>
            </mat-chip-set>
            
            <h1 class="lesson-title">{{ l.title }}</h1>
            <p class="lesson-description">{{ l.description }}</p>
            
            <div class="lesson-tags">
              @for (tag of l.tags; track tag) {
                <span class="tag">{{ tag }}</span>
              }
            </div>
          </div>
        </div>

        <!-- Content Sections -->
        <div class="content-sections">
          <!-- What Was Built -->
          <mat-card class="content-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>construction</mat-icon>
              <mat-card-title>What Was Built</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ l.whatWasBuilt }}</p>
            </mat-card-content>
          </mat-card>

          <!-- Decisions Made -->
          <mat-card class="content-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>gavel</mat-icon>
              <mat-card-title>Technical Decisions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="decisions-list">
                @for (decision of l.decisions; track decision.title) {
                  <div class="decision-item">
                    <h4>{{ decision.title }}</h4>
                    <p><strong>Decision:</strong> {{ decision.made }}</p>
                    <p class="reason"><strong>Why:</strong> {{ decision.reason }}</p>
                  </div>
                  @if (!$last) {
                    <mat-divider></mat-divider>
                  }
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Tradeoffs -->
          <mat-card class="content-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>balance</mat-icon>
              <mat-card-title>Tradeoffs Accepted</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="tradeoffs-list">
                @for (tradeoff of l.tradeoffs; track tradeoff.title) {
                  <div class="tradeoff-item">
                    <h4>{{ tradeoff.title }}</h4>
                    <div class="tradeoff-comparison">
                      <div class="chosen">
                        <span class="label">Chosen</span>
                        <span class="value">{{ tradeoff.chosen }}</span>
                      </div>
                      <mat-icon>arrow_forward</mat-icon>
                      <div class="rejected">
                        <span class="label">Rejected</span>
                        <span class="value">{{ tradeoff.rejected }}</span>
                      </div>
                    </div>
                    <p class="tradeoff-why"><strong>Why:</strong> {{ tradeoff.why }}</p>
                  </div>
                  @if (!$last) {
                    <mat-divider></mat-divider>
                  }
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Key Learnings -->
          <mat-card class="content-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>school</mat-icon>
              <mat-card-title>Key Learnings</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ul class="learnings-list">
                @for (learning of l.learnings; track learning) {
                  <li class="learning-item">
                    <mat-icon>check_circle</mat-icon>
                    <span>{{ learning }}</span>
                  </li>
                }
              </ul>
            </mat-card-content>
          </mat-card>

          <!-- Code Highlights -->
          @if (l.codeHighlights.length > 0) {
            <mat-card class="content-card">
              <mat-card-header>
                <mat-icon mat-card-avatar>code</mat-icon>
                <mat-card-title>Code Highlights</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="code-highlights">
                  @for (highlight of l.codeHighlights; track highlight.title) {
                    <div class="code-highlight">
                      <h4>{{ highlight.title }}</h4>
                      <p>{{ highlight.description }}</p>
                      <div class="code-badge">{{ highlight.language }}</div>
                    </div>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>

        <!-- Navigation Footer -->
        <div class="lesson-footer">
          <button mat-stroked-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Previous Lesson
          </button>
          <button mat-raised-button color="primary">
            Mark as Complete
            <mat-icon>check</mat-icon>
          </button>
          <button mat-stroked-button>
            Next Lesson
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .lesson-detail-container { max-width: 900px; margin: 0 auto; }

    .back-button {
      margin-bottom: 24px;
      color: #64748B;
    }

    .lesson-header {
      background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
      border-radius: 16px;
      padding: 40px;
      margin-bottom: 32px;
      color: white;
    }

    .lesson-meta { margin-bottom: 16px; }

    .lesson-title {
      font-size: 36px;
      font-weight: 800;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .lesson-description {
      font-size: 18px;
      line-height: 1.6;
      margin: 0 0 20px 0;
      opacity: 0.9;
    }

    .lesson-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tag {
      font-size: 12px;
      padding: 6px 12px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      font-weight: 500;
    }

    .content-sections {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 32px;
    }

    .content-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
    }

    .content-card mat-icon[mat-card-avatar] {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #2563EB;
    }

    mat-card-title {
      font-size: 20px !important;
      font-weight: 700 !important;
    }

    mat-card-content {
      font-size: 15px;
      line-height: 1.7;
      color: #475569;
    }

    .decisions-list, .tradeoffs-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .decision-item h4, .tradeoff-item h4 {
      font-size: 16px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 12px 0;
    }

    .decision-item p {
      margin: 0 0 8px 0;
      font-size: 14px;
    }

    .decision-item .reason {
      color: #64748B;
      font-style: italic;
    }

    .tradeoff-comparison {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      padding: 16px;
      background-color: #F8FAFC;
      border-radius: 8px;
    }

    .chosen, .rejected {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .chosen .label { color: #059669; font-size: 12px; font-weight: 600; }
    .rejected .label { color: #64748B; font-size: 12px; font-weight: 600; }
    .chosen .value { color: #1E293B; font-weight: 600; }
    .rejected .value { color: #64748B; }

    .tradeoff-comparison mat-icon {
      color: #94A3B8;
    }

    .tradeoff-why {
      margin: 0;
      font-size: 14px;
      color: #64748B;
      font-style: italic;
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
      color: #10B981;
      font-size: 20px;
    }

    .learning-item span {
      font-size: 15px;
      color: #475569;
      line-height: 1.6;
    }

    .code-highlights {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .code-highlight {
      padding: 16px;
      background-color: #F8FAFC;
      border-radius: 8px;
      border-left: 4px solid #2563EB;
    }

    .code-highlight h4 {
      font-size: 14px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .code-highlight p {
      font-size: 13px;
      color: #64748B;
      margin: 0 0 12px 0;
    }

    .code-badge {
      display: inline-block;
      font-size: 11px;
      padding: 4px 8px;
      background-color: #2563EB;
      color: white;
      border-radius: 4px;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
    }

    .lesson-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      background-color: #F8FAFC;
      border-radius: 12px;
      margin-top: 32px;
    }

    ::ng-deep .difficulty-beginner { background-color: #D1FAE5 !important; color: #059669 !important; }
    ::ng-deep .difficulty-intermediate { background-color: #DBEAFE !important; color: #2563EB !important; }
    ::ng-deep .difficulty-advanced { background-color: #FEF3C7 !important; color: #D97706 !important; }

    :host-context(.dark) {
      .content-card { background-color: #1E293B; border-color: #334155; }
      mat-card-title { color: #F8FAFC !important; }
      mat-card-content { color: #94A3B8; }
      .decision-item h4, .tradeoff-item h4 { color: #F8FAFC; }
      .tradeoff-comparison { background-color: #334155; }
      .chosen .value, .rejected .value { color: #F8FAFC; }
      .learning-item { border-color: #334155; }
      .learning-item span { color: #CBD5E1; }
      .code-highlight { background-color: #334155; }
      .code-highlight h4 { color: #F8FAFC; }
      .lesson-footer { background-color: #1E293B; }
    }
  `]
})
export class LessonDetailComponent {
  private location = inject(Location);
  id = input<string>();

  lesson = signal<LessonContent | null>({
    id: '02-enterprise-refactor',
    title: 'Enterprise Refactor',
    description: 'Transforming the initial dashboard into a professional enterprise learning system with proper documentation, architecture decisions, and a design system.',
    difficulty: 'intermediate',
    duration: '45 min',
    tags: ['Refactoring', 'Design System', 'Documentation', 'Architecture'],
    whatWasBuilt: 'A comprehensive learning portal with documented architecture decisions, a professional design system, and modular feature structure. The system includes ADRs (Architecture Decision Records), enterprise-grade UI patterns, and clear explanations of tradeoffs made during development.',
    decisions: [
      {
        title: 'UI Component Library',
        made: 'Use Angular Material over custom Tailwind components',
        reason: 'Accessibility compliance out of the box, enterprise standards alignment, and faster development allowing focus on content rather than component infrastructure.'
      },
      {
        title: 'State Management',
        made: 'Use Angular Signals for local state, RxJS for async',
        reason: 'Signals provide simpler API for component state while RxJS handles streams and HTTP operations effectively. This hybrid approach leverages strengths of both.'
      },
      {
        title: 'Content Storage',
        made: 'Store content as Markdown files in the repository',
        reason: 'Content is version controlled with code, no external dependencies, simple to update, and goes through PR review process.'
      }
    ],
    tradeoffs: [
      {
        title: 'Component Library',
        chosen: 'Angular Material',
        rejected: 'Custom Tailwind components',
        why: 'While we lost some visual uniqueness, we gained accessibility, maintainability, and faster development. This was acceptable for an internal learning tool.'
      },
      {
        title: 'Content Management',
        chosen: 'Markdown files',
        rejected: 'Headless CMS',
        why: 'Non-technical stakeholders cannot easily edit content, but for an internship project with primarily technical users, the simplicity and version control benefits outweighed this limitation.'
      }
    ],
    learnings: [
      'Writing ADRs forces articulation of decisions and creates valuable documentation for future reference.',
      'Design systems take upfront time but save time long-term through consistency and faster feature development.',
      'Enterprise UI patterns prioritize usability and information density over visual flashiness.',
      'File-based content works well for documentation that changes with code releases.',
      'The container/presentational component pattern improves testability and reusability.'
    ],
    codeHighlights: [
      {
        title: 'Signal-Based State',
        description: 'Using Angular Signals for reactive component state management',
        language: 'TypeScript'
      },
      {
        title: 'Standalone Components',
        description: 'Modern Angular pattern without NgModules',
        language: 'TypeScript'
      },
      {
        title: 'Lazy Loading Routes',
        description: 'Feature-based code splitting for performance',
        language: 'TypeScript'
      }
    ]
  });

  goBack(): void {
    this.location.back();
  }
}
