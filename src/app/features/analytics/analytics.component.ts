import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskRepository, TaskStats } from '../../core/repositories';
import { TimeEntryRepository, TimeSummary } from '../../core/repositories';
import { ProfileService } from '../../core/services/profile.service';
import { format, startOfWeek, endOfWeek, subDays, subMonths } from 'date-fns';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatProgressBarModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="analytics-container">
      <!-- Header -->
      <header class="analytics-header">
        <div>
          <h1 class="analytics-title">Analytics Dashboard</h1>
          <p class="analytics-subtitle">Track your progress and productivity insights</p>
        </div>
        <div class="period-selector">
          <button mat-button [class.active]="period() === 'week'" (click)="setPeriod('week')">
            This Week
          </button>
          <button mat-button [class.active]="period() === 'month'" (click)="setPeriod('month')">
            This Month
          </button>
          <button mat-button [class.active]="period() === 'quarter'" (click)="setPeriod('quarter')">
            This Quarter
          </button>
        </div>
      </header>

      <!-- Overview Stats -->
      <section class="overview-section">
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon" style="background-color: #DBEAFE;">
                  <mat-icon style="color: #2563EB;">task_alt</mat-icon>
                </div>
                <div class="stat-info">
                  <p class="stat-label">Tasks Completed</p>
                  <p class="stat-value">{{ taskStats().byStatus.completed }}</p>
                  <p class="stat-change positive">
                    <mat-icon>trending_up</mat-icon>
                    +{{ taskStats().completedThisWeek }} this week
                  </p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon" style="background-color: #D1FAE5;">
                  <mat-icon style="color: #059669;">schedule</mat-icon>
                </div>
                <div class="stat-info">
                  <p class="stat-label">Hours Logged</p>
                  <p class="stat-value">{{ timeSummary().totalHours }}h</p>
                  <p class="stat-change">
                    <mat-icon>calendar_today</mat-icon>
                    {{ timeSummary().thisWeek }}h this week
                  </p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon" style="background-color: #FEF3C7;">
                  <mat-icon style="color: #D97706;">hourglass_empty</mat-icon>
                </div>
                <div class="stat-info">
                  <p class="stat-label">In Progress</p>
                  <p class="stat-value">{{ taskStats().byStatus.in_progress }}</p>
                  <p class="stat-change">
                    <mat-icon>playlist</mat-icon>
                    {{ taskStats().total }} total tasks
                  </p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon" style="background-color: #FEE2E2;">
                  <mat-icon style="color: #DC2626;">warning</mat-icon>
                </div>
                <div class="stat-info">
                  <p class="stat-label">Overdue Tasks</p>
                  <p class="stat-value">{{ taskStats().overdue }}</p>
                  <p class="stat-change negative">
                    <mat-icon>priority_high</mat-icon>
                    Needs attention
                  </p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <!-- Charts and Details -->
      <section class="details-section">
        <mat-tab-group>
          <!-- Task Status Breakdown -->
          <mat-tab [label]="'Task Status'">
            <ng-template matTabContent>
              <div class="tab-content">
                <h3>Task Status Distribution</h3>
                <div class="status-breakdown">
                  @for (status of statusTypes(); track status.key) {
                    <div class="status-item">
                      <div class="status-header">
                        <div class="status-indicator" [style.background-color]="status.color"></div>
                        <span class="status-label">{{ status.label }}</span>
                        <span class="status-count">{{ taskStats().byStatus[status.key] }}</span>
                      </div>
                      <mat-progress-bar
                        mode="determinate"
                        [value]="(taskStats().byStatus[status.key] / taskStats().total) * 100"
                        [color]="status.color">
                      </mat-progress-bar>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </mat-tab>

          <!-- Time Distribution -->
          <mat-tab [label]="'Time Distribution'">
            <ng-template matTabContent>
              <div class="tab-content">
                <h3>Time by Task</h3>
                <div class="time-distribution">
                  @for (item of timeSummary().byTask; track item.task_id) {
                    <div class="time-item">
                      <div class="time-header">
                        <span class="task-title">{{ item.task_title }}</span>
                        <span class="task-hours">{{ item.hours }}h</span>
                      </div>
                      <mat-progress-bar
                        mode="determinate"
                        [value]="(item.hours / timeSummary().totalHours) * 100"
                        color="primary">
                      </mat-progress-bar>
                    </div>
                  }
                </div>

                <h3 style="margin-top: 32px;">Daily Activity</h3>
                <div class="daily-activity">
                  @for (day of timeSummary().byDay.slice(-14); track day.date) {
                    <div class="day-bar">
                      <div class="day-bar-fill"
                           [style.height.%]="((day.hours / 8) * 100)"
                           [title]="'{{ day.hours }}h'">
                      </div>
                      <span class="day-label">{{ formatDate(day.date) }}</span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </mat-tab>

          <!-- Priority Analysis -->
          <mat-tab [label]="'Priority Analysis'">
            <ng-template matTabContent>
              <div class="tab-content">
                <h3>Tasks by Priority</h3>
                <div class="priority-grid">
                  @for (priority of priorityTypes(); track priority.key) {
                    <mat-card class="priority-card" [class]="'priority-' + priority.key">
                      <mat-card-content>
                        <div class="priority-header">
                          <mat-icon>{{ priority.icon }}</mat-icon>
                          <div>
                            <p class="priority-title">{{ priority.label }}</p>
                            <p class="priority-count">{{ taskStats().byPriority[priority.key] }} tasks</p>
                          </div>
                        </div>
                      </mat-card-content>
                    </mat-card>
                  }
                </div>

                <h3 style="margin-top: 32px;">Work Distribution</h3>
                <div class="work-metrics">
                  <div class="metric-card">
                    <p class="metric-label">Estimated vs Actual</p>
                    <div class="metric-bars">
                      <div class="metric-bar-group">
                        <span class="metric-bar-label">Estimated</span>
                        <mat-progress-bar
                          mode="determinate"
                          [value]="100"
                          color="accent">
                        </mat-progress-bar>
                        <span class="metric-bar-value">{{ taskStats().totalEstimated }}h</span>
                      </div>
                      <div class="metric-bar-group">
                        <span class="metric-bar-label">Actual</span>
                        <mat-progress-bar
                          mode="determinate"
                          [value]="(taskStats().totalActual / taskStats().totalEstimated) * 100 || 0">
                        </mat-progress-bar>
                        <span class="metric-bar-value">{{ taskStats().totalActual }}h</span>
                      </div>
                    </div>
                  </div>

                  <div class="metric-card">
                    <p class="metric-label">Billable vs Non-Billable</p>
                    <div class="metric-bars">
                      <div class="metric-bar-group">
                        <span class="metric-bar-label">Billable</span>
                        <mat-progress-bar
                          mode="determinate"
                          [value]="100">
                        </mat-progress-bar>
                        <span class="metric-bar-value">{{ timeSummary().billableHours }}h</span>
                      </div>
                      <div class="metric-bar-group">
                        <span class="metric-bar-label">Non-Billable</span>
                        <mat-progress-bar
                          mode="determinate"
                          [value]="((timeSummary().totalHours - timeSummary().billableHours) / timeSummary().totalHours) * 100 || 0">
                        </mat-progress-bar>
                        <span class="metric-bar-value">{{ (timeSummary().totalHours - timeSummary().billableHours).toFixed(1) }}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ng-template>
          </mat-tab>

          <!-- Productivity Trends -->
          <mat-tab [label]="'Productivity Trends'">
            <ng-template matTabContent>
              <div class="tab-content">
                <h3>Weekly Comparison</h3>
                <div class="weekly-comparison">
                  <div class="comparison-item">
                    <p class="comparison-label">Tasks Completed</p>
                    <p class="comparison-value">{{ taskStats().completedThisWeek }}</p>
                    <p class="comparison-trend positive">↑ 12% vs last week</p>
                  </div>
                  <div class="comparison-item">
                    <p class="comparison-label">Hours Logged</p>
                    <p class="comparison-value">{{ timeSummary().thisWeek }}h</p>
                    <p class="comparison-trend positive">↑ 8% vs last week</p>
                  </div>
                  <div class="comparison-item">
                    <p class="comparison-label">Avg Hours/Day</p>
                    <p class="comparison-value">{{ (timeSummary().thisWeek / 5).toFixed(1) }}h</p>
                    <p class="comparison-trend">{{ (timeSummary().thisWeek / 5) >= 8 ? '✓ On target' : '↓ Below target' }}</p>
                  </div>
                </div>

                <h3 style="margin-top: 32px;">Goal Progress</h3>
                <div class="goals-section">
                  <mat-card class="goal-card">
                    <mat-card-content>
                      <div class="goal-header">
                        <mat-icon>flag</mat-icon>
                        <div>
                          <p class="goal-title">Daily Target: {{ profileService.dailyGoalHours() }}h</p>
                          <mat-progress-bar
                            mode="determinate"
                            [value]="(timeSummary().thisWeek / 5 / profileService.dailyGoalHours()) * 100 || 0">
                          </mat-progress-bar>
                        </div>
                      </div>
                    </mat-card-content>
                  </mat-card>
                </div>
              </div>
            </ng-template>
          </mat-tab>
        </mat-tab-group>
      </section>
    </div>
  `,
  styles: [`
    .analytics-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .analytics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .analytics-title {
      font-size: 32px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .analytics-subtitle {
      font-size: 16px;
      color: #64748B;
      margin: 0;
    }

    .period-selector {
      display: flex;
      gap: 8px;
      background-color: #F1F5F9;
      padding: 4px;
      border-radius: 8px;
    }

    .period-selector button {
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
    }

    .period-selector button.active {
      background-color: white;
      color: #2563EB;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .overview-section {
      margin-bottom: 32px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
    }

    .stat-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
    }

    .stat-content {
      display: flex;
      gap: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748B;
      margin: 0 0 8px 0;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 800;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .stat-change {
      font-size: 13px;
      color: #64748B;
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0;
    }

    .stat-change.positive { color: #10B981; }
    .stat-change.negative { color: #EF4444; }

    .stat-change mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .details-section {
      background-color: white;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      overflow: hidden;
    }

    .tab-content {
      padding: 32px;
    }

    .tab-content h3 {
      font-size: 20px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 24px 0;
    }

    .status-breakdown {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .status-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .status-label {
      font-weight: 600;
      color: #1E293B;
      flex: 1;
    }

    .status-count {
      font-weight: 700;
      color: #64748B;
    }

    .time-distribution {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .time-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .time-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .task-title {
      font-weight: 600;
      color: #1E293B;
    }

    .task-hours {
      font-weight: 700;
      color: #2563EB;
    }

    .daily-activity {
      display: flex;
      gap: 8px;
      height: 200px;
      align-items: flex-end;
      padding-top: 32px;
    }

    .day-bar {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      height: 100%;
    }

    .day-bar-fill {
      width: 100%;
      background: linear-gradient(180deg, #2563EB 0%, #3B82F6 100%);
      border-radius: 4px 4px 0 0;
      min-height: 4px;
      transition: height 0.3s ease;
    }

    .day-label {
      font-size: 10px;
      color: #64748B;
      font-weight: 600;
    }

    .priority-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .priority-card {
      border-radius: 8px;
    }

    .priority-card.priority-low { border-left: 4px solid #64748B; }
    .priority-card.priority-medium { border-left: 4px solid #F59E0B; }
    .priority-card.priority-high { border-left: 4px solid #F97316; }
    .priority-card.priority-urgent { border-left: 4px solid #EF4444; }

    .priority-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .priority-title {
      font-weight: 600;
      color: #1E293B;
      margin: 0;
    }

    .priority-count {
      font-size: 14px;
      color: #64748B;
      margin: 4px 0 0 0;
    }

    .work-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .metric-card {
      background-color: #F8FAFC;
      border-radius: 8px;
      padding: 24px;
    }

    .metric-label {
      font-weight: 600;
      color: #1E293B;
      margin: 0 0 16px 0;
    }

    .metric-bars {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .metric-bar-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .metric-bar-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748B;
      min-width: 80px;
    }

    .metric-bar-value {
      font-size: 14px;
      font-weight: 700;
      color: #2563EB;
      min-width: 50px;
      text-align: right;
    }

    .weekly-comparison {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .comparison-item {
      background-color: #F8FAFC;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
    }

    .comparison-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748B;
      margin: 0 0 8px 0;
    }

    .comparison-value {
      font-size: 32px;
      font-weight: 800;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .comparison-trend {
      font-size: 13px;
      margin: 0;
      color: #10B981;
    }

    .goals-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .goal-card {
      border-radius: 8px;
      border: 1px solid #E2E8F0;
    }

    .goal-header {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .goal-title {
      font-weight: 600;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    /* Dark mode */
    :host-context(.dark) {
      .analytics-title { color: #F8FAFC; }
      .analytics-subtitle { color: #94A3B8; }
      .stat-card, .details-section {
        background-color: #1E293B;
        border-color: #334155;
      }
      .stat-value, .status-label, .priority-title, .metric-label, .comparison-value, .goal-title {
        color: #F8FAFC;
      }
      .task-title { color: #CBD5E1; }
      .metric-card { background-color: #0F172A; }
      .comparison-item { background-color: #0F172A; }
    }
  `]
})
export class AnalyticsComponent {
  private taskRepo = inject(TaskRepository);
  private timeRepo = inject(TimeEntryRepository);
  protected profileService = inject(ProfileService);

  period = signal<'week' | 'month' | 'quarter'>('week');
  taskStats = signal<TaskStats>({
    total: 0,
    byStatus: { todo: 0, in_progress: 0, review: 0, completed: 0, cancelled: 0 },
    byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    totalEstimated: 0,
    totalActual: 0,
    completedThisWeek: 0,
    overdue: 0
  });
  timeSummary = signal<TimeSummary>({
    totalHours: 0,
    billableHours: 0,
    byTask: [],
    byDay: [],
    thisWeek: 0,
    thisMonth: 0
  });

  statusTypes = signal([
    { key: 'todo' as const, label: 'To Do', color: '#64748B' },
    { key: 'in_progress' as const, label: 'In Progress', color: '#3B82F6' },
    { key: 'review' as const, label: 'In Review', color: '#F59E0B' },
    { key: 'completed' as const, label: 'Completed', color: '#10B981' },
    { key: 'cancelled' as const, label: 'Cancelled', color: '#EF4444' }
  ]);

  priorityTypes = signal([
    { key: 'low' as const, label: 'Low', icon: 'arrow_downward' },
    { key: 'medium' as const, label: 'Medium', icon: 'remove' },
    { key: 'high' as const, label: 'High', icon: 'arrow_upward' },
    { key: 'urgent' as const, label: 'Urgent', icon: 'priority_high' }
  ]);

  async ngOnInit() {
    await this.loadAnalytics();
  }

  setPeriod(p: 'week' | 'month' | 'quarter') {
    this.period.set(p);
    this.loadAnalytics();
  }

  private async loadAnalytics() {
    const user = this.profileService.currentUser();
    if (!user) return;

    this.taskStats.set(await this.taskRepo.getTaskStats({ assignee_id: user.id }));
    this.timeSummary.set(await this.timeRepo.getTimeSummary(user.id));
  }

  formatDate(dateStr: string): string {
    return format(new Date(dateStr), 'MMM d');
  }
}
