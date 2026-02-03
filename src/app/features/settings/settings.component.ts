import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { DatabaseService } from '../../core/services/database.service';
import { User, UserSettings } from '../../core/repositories';

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule
  ],
  template: `
    <div class="settings-container">
      <!-- Header -->
      <header class="settings-header">
        <div>
          <h1 class="settings-title">Settings</h1>
          <p class="settings-subtitle">Manage your profile and application preferences</p>
        </div>
      </header>

      @if (loading()) {
        <div class="loading-state">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading settings...</p>
        </div>
      } @else {
        <div class="settings-content">
          <!-- Profile Section -->
          <mat-card class="settings-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>account_circle</mat-icon>
              <mat-card-title>Profile</mat-card-title>
              <mat-card-subtitle>Your personal information</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="form-field">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Name</mat-label>
                  <input matInput [(ngModel)]="profileForm().name" placeholder="Your full name" />
                </mat-form-field>
              </div>

              <div class="form-field">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput [(ngModel)]="profileForm().email" type="email" placeholder="your@email.com" />
                </mat-form-field>
              </div>

              <div class="form-field">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Role</mat-label>
                  <mat-select [(ngModel)]="profileForm().role">
                    <mat-option value="intern">Intern</mat-option>
                    <mat-option value="junior">Junior Developer</mat-option>
                    <mat-option value="mid">Mid-Level Developer</mat-option>
                    <mat-option value="senior">Senior Developer</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="form-actions">
                <button mat-button color="primary" (click)="saveProfile()" [disabled]="saving()">
                  @if (saving()) {
                    <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
                  }
                  {{ saving() ? 'Saving...' : 'Save Profile' }}
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Appearance Section -->
          <mat-card class="settings-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>palette</mat-icon>
              <mat-card-title>Appearance</mat-card-title>
              <mat-card-subtitle>Customize the look and feel</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="setting-item">
                <div class="setting-info">
                  <mat-icon>{{ appearanceForm().theme === 'dark' ? 'dark_mode' : 'light_mode' }}</mat-icon>
                  <div>
                    <p class="setting-label">Theme</p>
                    <p class="setting-description">Choose your preferred color scheme</p>
                  </div>
                </div>
                <mat-button-toggle-group [(value)]="appearanceForm().theme" (change)="onThemeChange()">
                  <mat-button-toggle value="light">Light</mat-button-toggle>
                  <mat-button-toggle value="dark">Dark</mat-button-toggle>
                </mat-button-toggle-group>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Work Schedule Section -->
          <mat-card class="settings-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>schedule</mat-icon>
              <mat-card-title>Work Schedule</mat-card-title>
              <mat-card-subtitle>Configure your work hours</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="setting-item">
                <div class="setting-info">
                  <mat-icon>work</mat-icon>
                  <div>
                    <p class="setting-label">Daily Goal Hours</p>
                    <p class="setting-description">Target hours per workday</p>
                  </div>
                </div>
                <div class="slider-container">
                  <mat-slider
                    [(ngModel)]="scheduleForm().dailyGoalHours"
                    [min]="1"
                    [max]="12"
                    [step]="0.5"
                    [showTickMarks]="true">
                  </mat-slider>
                  <span class="slider-value">{{ scheduleForm().dailyGoalHours }}h</span>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="setting-item">
                <div class="setting-info">
                  <mat-icon>calendar_today</mat-icon>
                  <div>
                    <p class="setting-label">Week Start Day</p>
                    <p class="setting-description">First day of the week</p>
                  </div>
                </div>
                <mat-form-field appearance="outline">
                  <mat-select [(ngModel)]="scheduleForm().weekStartDay">
                    <mat-option value="sunday">Sunday</mat-option>
                    <mat-option value="monday">Monday</mat-option>
                    <mat-option value="saturday">Saturday</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="form-actions">
                <button mat-button color="primary" (click)="saveSchedule()">Save Schedule</button>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Notifications Section -->
          <mat-card class="settings-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>notifications</mat-icon>
              <mat-card-title>Notifications</mat-card-title>
              <mat-card-subtitle>Manage your notification preferences</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="setting-item">
                <div class="setting-info">
                  <mat-icon>bell</mat-icon>
                  <div>
                    <p class="setting-label">Enable Notifications</p>
                    <p class="setting-description">Receive alerts for important updates</p>
                  </div>
                </div>
                <mat-slide-toggle [(ngModel)]="notificationsForm().enabled" (change)="onNotificationChange()">
                </mat-slide-toggle>
              </div>

              @if (notificationsForm().enabled) {
                <mat-divider></mat-divider>

                <div class="setting-item">
                  <div class="setting-info">
                    <mat-icon>task_alt</mat-icon>
                    <div>
                      <p class="setting-label">Task Reminders</p>
                      <p class="setting-description">Get reminded about upcoming due dates</p>
                    </div>
                  </div>
                  <mat-slide-toggle [(ngModel)]="notificationsForm().taskReminders"></mat-slide-toggle>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <mat-icon>timer</mat-icon>
                    <div>
                      <p class="setting-label">Time Logging Reminders</p>
                      <p class="setting-description">Remind to log time regularly</p>
                    </div>
                  </div>
                  <mat-slide-toggle [(ngModel)]="notificationsForm().timeReminders"></mat-slide-toggle>
                </div>
              }

              <div class="form-actions">
                <button mat-button color="primary" (click)="saveNotifications()">
                  Save Notification Settings
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Data Management Section -->
          <mat-card class="settings-card danger-zone">
            <mat-card-header>
              <mat-icon mat-card-avatar class="danger-icon">warning</mat-icon>
              <mat-card-title>Data Management</mat-card-title>
              <mat-card-subtitle>Manage your application data</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="danger-actions">
                <button mat-button (click)="exportData()">
                  <mat-icon>download</mat-icon>
                  Export All Data
                </button>

                <button mat-button color="warn" (click)="confirmResetData()">
                  <mat-icon>refresh</mat-icon>
                  Reset All Data
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
    }

    .settings-header {
      margin-bottom: 32px;
    }

    .settings-title {
      font-size: 32px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .settings-subtitle {
      font-size: 16px;
      color: #64748B;
      margin: 0;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
    }

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .settings-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
    }

    .form-field {
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .button-spinner {
      margin-right: 8px;
      vertical-align: middle;
    }

    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      gap: 24px;
    }

    .setting-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .setting-info mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: #64748B;
    }

    .setting-label {
      font-weight: 600;
      color: #1E293B;
      margin: 0 0 4px 0;
    }

    .setting-description {
      font-size: 14px;
      color: #64748B;
      margin: 0;
    }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 200px;
    }

    .slider-value {
      font-weight: 600;
      color: #2563EB;
      min-width: 40px;
      text-align: right;
    }

    .danger-zone {
      border-color: #FCA5A5;
      background-color: #FEF2F2;
    }

    .danger-icon {
      color: #EF4444 !important;
    }

    .danger-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .danger-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Dark mode */
    :host-context(.dark) {
      .settings-title { color: #F8FAFC; }
      .settings-subtitle { color: #94A3B8; }
      .settings-card {
        background-color: #1E293B;
        border-color: #334155;
      }
      .setting-label { color: #F8FAFC; }
      .setting-description { color: #94A3B8; }
      .danger-zone {
        background-color: #450A0A;
        border-color: #7F1D1D;
      }
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: 16px;
      }

      .setting-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .slider-container {
        width: 100%;
      }
    }
  `]
})
export class SettingsComponent {
  private profileService = inject(ProfileService);
  private db = inject(DatabaseService);

  loading = signal(true);
  saving = signal(false);

  // Profile form
  profileForm = signal<{
    name: string;
    email: string;
    role: string;
  }>({
    name: '',
    email: '',
    role: 'intern'
  });

  // Appearance form
  appearanceForm = signal<{
    theme: 'light' | 'dark';
  }>({
    theme: 'light'
  });

  // Schedule form
  scheduleForm = signal<{
    dailyGoalHours: number;
    weekStartDay: string;
  }>({
    dailyGoalHours: 8,
    weekStartDay: 'monday'
  });

  // Notifications form
  notificationsForm = signal<{
    enabled: boolean;
    taskReminders: boolean;
    timeReminders: boolean;
  }>({
    enabled: true,
    taskReminders: true,
    timeReminders: true
  });

  async ngOnInit() {
    await this.loadSettings();
    this.loading.set(false);
  }

  private async loadSettings() {
    const user = this.profileService.currentUser();
    const settings = this.profileService.currentSettings();

    if (user) {
      this.profileForm.set({
        name: user.name,
        email: user.email,
        role: user.role
      });
    }

    if (settings) {
      this.appearanceForm.set({
        theme: settings.theme
      });

      this.scheduleForm.set({
        dailyGoalHours: settings.daily_goal_hours,
        weekStartDay: settings.week_start_day
      });

      this.notificationsForm.set({
        enabled: settings.notifications_enabled,
        taskReminders: true,
        timeReminders: true
      });
    }
  }

  async saveProfile() {
    this.saving.set(true);
    try {
      await this.profileService.updateProfile(this.profileForm());
      // Show success message
    } finally {
      this.saving.set(false);
    }
  }

  async onThemeChange() {
    await this.profileService.updateSettings(this.appearanceForm());
    this.profileService.setTheme(this.appearanceForm().theme);
  }

  async saveSchedule() {
    await this.profileService.updateSettings({
      daily_goal_hours: this.scheduleForm().dailyGoalHours,
      week_start_day: this.scheduleForm().weekStartDay
    });
  }

  async onNotificationChange() {
    await this.profileService.updateSettings({
      notifications_enabled: this.notificationsForm().enabled
    });
  }

  async saveNotifications() {
    await this.profileService.updateSettings({
      notifications_enabled: this.notificationsForm().enabled
    });
  }

  exportData() {
    const data = JSON.stringify({
      user: this.profileService.currentUser(),
      settings: this.profileService.currentSettings(),
      exportDate: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cadwork-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async confirmResetData() {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      await this.db.reset();
      window.location.reload();
    }
  }
}
