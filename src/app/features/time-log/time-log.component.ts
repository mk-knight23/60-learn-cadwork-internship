import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { TimeEntryRepository, TimeEntry, TaskRepository } from '../../core/repositories';
import { ProfileService } from '../../core/services/profile.service';
import { format, startOfWeek, endOfWeek } from 'date-fns';

interface TimerDisplay {
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-time-log',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="time-log-container">
      <!-- Header with Timer -->
      <header class="time-log-header">
        <div>
          <h1 class="time-log-title">Time Log</h1>
          <p class="time-log-subtitle">Track your work hours and productivity</p>
        </div>

        <!-- Active Timer -->
        <mat-card class="timer-card" [class.running]="isRunning()">
          <mat-card-content>
            <div class="timer-display">
              <div class="timer-digits">{{ formattedTime() }}</div>
              <div class="timer-controls">
                @if (!isRunning()) {
                  <button mat-fab color="primary" (click)="startTimer()" matTooltip="Start Timer">
                    <mat-icon>play_arrow</mat-icon>
                  </button>
                } @else {
                  <button mat-fab color="warn" (click)="stopTimer()" matTooltip="Stop Timer">
                    <mat-icon>stop</mat-icon>
                  </button>
                  <button mat-fab (click)="pauseTimer()" matTooltip="Pause Timer">
                    @if (isPaused()) {
                      <mat-icon>play_arrow</mat-icon>
                    } @else {
                      <mat-icon>pause</mat-icon>
                    }
                  </button>
                }
                <button mat-fab (click)="resetTimer()" matTooltip="Reset Timer" [disabled]="!isRunning() && !currentEntry()">
                  <mat-icon>refresh</mat-icon>
                </button>
              </div>
            </div>

            <div class="timer-task">
              @if (currentEntry()) {
                <div class="active-task-info">
                  <mat-icon>task_alt</mat-icon>
                  <span>{{ currentEntry()?.description || 'No description' }}</span>
                </div>
              } @else {
                <mat-form-field appearance="outline" class="task-select">
                  <mat-label>Task (optional)</mat-label>
                  <mat-select [(ngModel)]="selectedTaskId">
                    <mat-option [value]="null">No task selected</mat-option>
                    @for (task of availableTasks(); track task.id) {
                      <mat-option [value]="task.id">{{ task.title }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </header>

      <!-- Summary Stats -->
      <section class="summary-section">
        <div class="summary-cards">
          <mat-card class="summary-card">
            <mat-card-content>
              <div class="summary-content">
                <mat-icon>today</mat-icon>
                <div>
                  <p class="summary-label">Today</p>
                  <p class="summary-value">{{ todayTotal() }}h</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card">
            <mat-card-content>
              <div class="summary-content">
                <mat-icon>date_range</mat-icon>
                <div>
                  <p class="summary-label">This Week</p>
                  <p class="summary-value">{{ weeklyTotal() }}h</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card">
            <mat-card-content>
              <div class="summary-content">
                <mat-icon>calendar_month</mat-icon>
                <div>
                  <p class="summary-label">This Month</p>
                  <p class="summary-value">{{ monthlyTotal() }}h</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card">
            <mat-card-content>
              <div class="summary-content">
                <mat-icon>trending_up</mat-icon>
                <div>
                  <p class="summary-label">Daily Average</p>
                  <p class="summary-value">{{ dailyAverage() }}h</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <!-- Time Entries Table -->
      <section class="entries-section">
        <mat-card class="entries-card">
          <mat-card-header>
            <mat-card-title>Time Entries</mat-card-title>
            <div class="entries-actions">
              <mat-form-field appearance="outline" class="date-filter">
                <mat-label>Filter by Date</mat-label>
                <input matInput />
              </mat-form-field>
              <button mat-button (click)="loadTimeEntries()">
                <mat-icon>refresh</mat-icon>
                Refresh
              </button>
            </div>
          </mat-card-header>
          <mat-card-content>
            <table class="time-table" mat-table [dataSource]="timeEntries()">
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let entry">
                  {{ formatDate(entry.start_time) }}
                </td>
              </ng-container>

              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let entry">
                  <div class="entry-description">
                    <span>{{ entry.description || 'No description' }}</span>
                    @if (entry.task_id) {
                      <mat-chip-listbox>
                        <mat-chip>Task</mat-chip>
                      </mat-chip-listbox>
                    }
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="duration">
                <th mat-header-cell *matHeaderCellDef>Duration</th>
                <td mat-cell *matCellDef="let entry">
                  <span class="duration-badge">{{ formatDuration(entry.duration) }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="billable">
                <th mat-header-cell *matHeaderCellDef>Billable</th>
                <td mat-cell *matCellDef="let entry">
                  @if (entry.billable) {
                    <mat-icon class="billable-icon">check_circle</mat-icon>
                  } @else {
                    <mat-icon class="non-billable-icon">cancel</mat-icon>
                  }
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let entry">
                  <button mat-icon-button (click)="editEntry(entry.id)" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteEntry(entry.id)" matTooltip="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            @if (timeEntries().length === 0) {
              <div class="empty-state">
                <mat-icon>schedule</mat-icon>
                <p>No time entries yet. Start the timer to track your work!</p>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </section>

      <!-- Quick Add Entry -->
      <section class="quick-add-section">
        <mat-card class="quick-add-card">
          <mat-card-header>
            <mat-card-title>Quick Add Entry</mat-card-title>
            <mat-card-subtitle>Manually add a time entry</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-add-form">
              <mat-form-field appearance="outline">
                <mat-label>Description</mat-label>
                <input matInput [(ngModel)]="newEntry().description" placeholder="What did you work on?" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Duration (hours)</mat-label>
                <input matInput type="number" [(ngModel)]="newEntry().duration" placeholder="1.5" />
              </mat-form-field>

              <button mat-button color="primary" (click)="quickAddEntry()">
                <mat-icon>add</mat-icon>
                Add Entry
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </section>
    </div>
  `,
  styles: [`
    .time-log-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .time-log-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 24px;
    }

    .time-log-title {
      font-size: 32px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .time-log-subtitle {
      font-size: 16px;
      color: #64748B;
      margin: 0;
    }

    .timer-card {
      background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
      border: none;
      color: white;
      min-width: 300px;
    }

    .timer-card.running {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }

    .timer-card ::ng-deep .mat-mdc-card-content {
      padding: 24px;
    }

    .timer-display {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .timer-digits {
      font-family: 'JetBrains Mono', monospace;
      font-size: 48px;
      font-weight: 700;
      text-align: center;
      letter-spacing: 0.05em;
    }

    .timer-controls {
      display: flex;
      justify-content: center;
      gap: 12px;
    }

    .timer-controls button.mat-fab {
      width: 48px;
      height: 48px;
    }

    .timer-task {
      margin-top: 16px;
    }

    .active-task-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }

    .task-select {
      width: 100%;
    }

    .task-select ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .summary-section {
      margin-bottom: 32px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .summary-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
    }

    .summary-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .summary-content mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #64748B;
    }

    .summary-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748B;
      margin: 0 0 4px 0;
    }

    .summary-value {
      font-size: 24px;
      font-weight: 800;
      color: #1E293B;
      margin: 0;
    }

    .entries-section {
      margin-bottom: 32px;
    }

    .entries-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
    }

    .entries-card mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .entries-actions {
      display: flex;
      gap: 12px;
    }

    .date-filter {
      width: 200px;
    }

    .time-table {
      width: 100%;
    }

    .time-table mat-header-cell {
      font-weight: 600;
      color: #64748B;
    }

    .time-table mat-cell {
      color: #1E293B;
    }

    .entry-description {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .duration-badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: #DBEAFE;
      color: #2563EB;
      border-radius: 12px;
      font-weight: 600;
      font-size: 13px;
    }

    .billable-icon {
      color: #10B981;
    }

    .non-billable-icon {
      color: #94A3B8;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
      color: #94A3B8;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .quick-add-section {
      margin-bottom: 32px;
    }

    .quick-add-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
    }

    .quick-add-form {
      display: flex;
      gap: 16px;
      align-items: flex-end;
    }

    .quick-add-form mat-form-field {
      flex: 1;
    }

    /* Dark mode */
    :host-context(.dark) {
      .time-log-title { color: #F8FAFC; }
      .summary-card, .entries-card, .quick-add-card {
        background-color: #1E293B;
        border-color: #334155;
      }
      .summary-value { color: #F8FAFC; }
      .time-table mat-cell { color: #CBD5E1; }
    }
  `]
})
export class TimeLogComponent {
  private timeRepo = inject(TimeEntryRepository);
  private taskRepo = inject(TaskRepository);
  private profileService = inject(ProfileService);

  displayedColumns: string[] = ['date', 'description', 'duration', 'billable', 'actions'];
  timeEntries = signal<TimeEntry[]>([]);
  currentEntry = signal<TimeEntry | null>(null);

  isRunning = signal(false);
  isPaused = signal(false);
  timerValue = signal(0); // in seconds

  selectedTaskId = signal<string | null>(null);
  availableTasks = signal<any[]>([]);

  todayTotal = signal('0.0');
  weeklyTotal = signal('0.0');
  monthlyTotal = signal('0.0');
  dailyAverage = signal('0.0');

  newEntry = signal<{
    description: string;
    duration: number;
  }>({
    description: '',
    duration: 1
  });

  private timerInterval: any = null;

  async ngOnInit() {
    await this.loadData();
    this.checkActiveTimer();
  }

  private async loadData() {
    const user = this.profileService.currentUser();
    if (!user) return;

    this.timeEntries.set(await this.timeRepo.getAllTimeEntries(user.id));
    this.availableTasks.set(await this.taskRepo.getAllTasks());

    const summary = await this.timeRepo.getTimeSummary(user.id);
    this.todayTotal.set(summary.totalHours.toFixed(1));
    this.weeklyTotal.set(summary.thisWeek.toFixed(1));
    this.monthlyTotal.set(summary.thisMonth.toFixed(1));
    this.dailyAverage.set((summary.thisWeek / 5).toFixed(1));
  }

  private async checkActiveTimer() {
    const user = this.profileService.currentUser();
    if (!user) return;

    const active = await this.timeRepo.getActiveTimeEntry(user.id);
    if (active) {
      this.currentEntry.set(active);
      this.isRunning.set(true);
      this.isPaused.set(false);

      const elapsed = Math.floor((Date.now() - new Date(active.start_time).getTime()) / 1000);
      this.timerValue.set(elapsed);
      this.startTimerInterval();
    }
  }

  async startTimer() {
    const user = this.profileService.currentUser();
    if (!user) return;

    const entry = await this.timeRepo.startTimeEntry(user.id, this.selectedTaskId(), 'Time entry');
    this.currentEntry.set(entry);
    this.isRunning.set(true);
    this.isPaused.set(false);
    this.timerValue.set(0);
    this.startTimerInterval();
  }

  async stopTimer() {
    if (this.currentEntry()) {
      clearInterval(this.timerInterval);
      const entry = await this.timeRepo.stopTimeEntry(this.currentEntry()!.id);
      await this.timeRepo.updateTaskActualHours(entry.task_id!);
      this.currentEntry.set(null);
      this.isRunning.set(false);
      this.isPaused.set(false);
      this.timerValue.set(0);
      await this.loadData();
    }
  }

  pauseTimer() {
    if (this.isPaused()) {
      this.isPaused.set(false);
      this.startTimerInterval();
    } else {
      this.isPaused.set(true);
      clearInterval(this.timerInterval);
    }
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.currentEntry.set(null);
    this.isRunning.set(false);
    this.isPaused.set(false);
    this.timerValue.set(0);
  }

  private startTimerInterval() {
    this.timerInterval = setInterval(() => {
      this.timerValue.update(v => v + 1);
    }, 1000);
  }

  formattedTime(): string {
    const totalSeconds = this.timerValue();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  async loadTimeEntries() {
    await this.loadData();
  }

  async deleteEntry(id: string) {
    if (confirm('Delete this time entry?')) {
      await this.timeRepo.deleteTimeEntry(id);
      await this.loadData();
    }
  }

  editEntry(id: string) {
    // TODO: Implement edit dialog
    console.log('Edit entry:', id);
  }

  async quickAddEntry() {
    const user = this.profileService.currentUser();
    if (!user || !this.newEntry().description) return;

    const startTime = new Date();
    startTime.setHours(startTime.getHours() - this.newEntry().duration);

    await this.timeRepo.createTimeEntry({
      user_id: user.id,
      description: this.newEntry().description,
      start_time: startTime.toISOString(),
      end_time: new Date().toISOString(),
      billable: false
    });

    this.newEntry.set({ description: '', duration: 1 });
    await this.loadData();
  }

  formatDate(dateStr: string): string {
    return format(new Date(dateStr), 'MMM d, yyyy');
  }

  formatDuration(seconds: number | null): string {
    if (!seconds) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}
