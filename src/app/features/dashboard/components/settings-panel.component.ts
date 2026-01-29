import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { SettingsService, ThemeMode } from '../../../core/services/settings.service';
import { StatsService } from '../../../core/services/stats.service';
import { AudioService } from '../../../core/services/audio.service';
import { KeyboardService } from '../../../core/services/keyboard.service';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatCardModule,
    FormsModule
  ],
  template: `
    @if (settingsService.showHelp()) {
      <div class="settings-overlay" (click)="close()">
        <div class="settings-dialog" (click)="$event.stopPropagation()">
          <div class="settings-header">
            <h2>Settings</h2>
            <button mat-icon-button (click)="close()" class="close-button">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="settings-content">
            <!-- Theme Section -->
            <div class="settings-section">
              <h3>Theme</h3>
              <mat-button-toggle-group 
                [value]="settingsService.theme()"
                (change)="setTheme($event.value)"
                aria-label="Theme selection">
                <mat-button-toggle value="light">
                  <mat-icon>light_mode</mat-icon>
                  Light
                </mat-button-toggle>
                <mat-button-toggle value="dark">
                  <mat-icon>dark_mode</mat-icon>
                  Dark
                </mat-button-toggle>
                <mat-button-toggle value="system">
                  <mat-icon>computer</mat-icon>
                  System
                </mat-button-toggle>
              </mat-button-toggle-group>
            </div>

            <mat-divider></mat-divider>

            <!-- Sound Section -->
            <div class="settings-section">
              <h3>Sound Effects</h3>
              <mat-slide-toggle 
                [checked]="settingsService.soundEnabled()"
                (change)="toggleSound()"
                color="primary">
                Enable UI sounds
              </mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <!-- Statistics Section -->
            <div class="settings-section">
              <h3>Session Statistics</h3>
              <div class="stats-grid">
                <mat-card class="stat-item">
                  <mat-icon>folder_open</mat-icon>
                  <span class="stat-value">{{ statsService.totalProjectsViewed() }}</span>
                  <span class="stat-label">Projects Viewed</span>
                </mat-card>
                <mat-card class="stat-item">
                  <mat-icon>task_alt</mat-icon>
                  <span class="stat-value">{{ statsService.totalTasksCompleted() }}</span>
                  <span class="stat-label">Tasks Done</span>
                </mat-card>
                <mat-card class="stat-item">
                  <mat-icon>schedule</mat-icon>
                  <span class="stat-value">{{ statsService.formatTime() }}</span>
                  <span class="stat-label">Time Spent</span>
                </mat-card>
              </div>
              <button mat-stroked-button color="warn" (click)="resetStats()" class="reset-button">
                <mat-icon>refresh</mat-icon>
                Reset Statistics
              </button>
            </div>

            <mat-divider></mat-divider>

            <!-- Keyboard Shortcuts Section -->
            <div class="settings-section">
              <h3>Keyboard Shortcuts</h3>
              <div class="shortcuts-list">
                @for (shortcut of keyboardService.getShortcuts(); track shortcut.key) {
                  <div class="shortcut-item">
                    <span class="shortcut-action">{{ shortcut.action }}</span>
                    <kbd class="shortcut-key">{{ shortcut.key }}</kbd>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="settings-footer">
            <p>Cadwork Internship Portal v2.0</p>
            <p>Built with Angular 19</p>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .settings-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .settings-dialog {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 16px;
      border-bottom: 1px solid #E2E8F0;
    }

    .settings-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1E293B;
      margin: 0;
    }

    .close-button {
      color: #64748B;
    }

    .settings-content {
      padding: 24px;
    }

    .settings-section {
      padding: 8px 0;
    }

    .settings-section h3 {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748B;
      margin: 0 0 16px 0;
    }

    mat-button-toggle-group {
      width: 100%;
    }

    mat-button-toggle {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .stat-item {
      text-align: center;
      padding: 16px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .stat-item mat-icon {
      color: #2563EB;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 800;
      color: #1E293B;
    }

    .stat-label {
      font-size: 11px;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .reset-button {
      width: 100%;
    }

    .shortcuts-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .shortcut-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: #F8FAFC;
      border-radius: 8px;
    }

    .shortcut-action {
      font-size: 14px;
      color: #475569;
    }

    .shortcut-key {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      padding: 4px 10px;
      background-color: #E2E8F0;
      border-radius: 6px;
      color: #1E293B;
      font-weight: 600;
      border: none;
    }

    .settings-footer {
      text-align: center;
      padding: 16px 24px 24px;
      border-top: 1px solid #E2E8F0;
    }

    .settings-footer p {
      font-size: 12px;
      color: #94A3B8;
      margin: 0;
    }

    :host-context(.dark) {
      .settings-dialog { background-color: #1E293B; }
      .settings-header { border-color: #334155; }
      .settings-header h2 { color: #F8FAFC; }
      .settings-section h3 { color: #94A3B8; }
      .stat-item { background-color: #334155; }
      .stat-value { color: #F8FAFC; }
      .shortcut-item { background-color: #334155; }
      .shortcut-action { color: #CBD5E1; }
      .shortcut-key { background-color: #475569; color: #F8FAFC; }
      .settings-footer { border-color: #334155; }
    }
  `]
})
export class SettingsPanelComponent {
  settingsService = inject(SettingsService);
  statsService = inject(StatsService);
  private audioService = inject(AudioService);
  keyboardService = inject(KeyboardService);

  themeModes: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'system', label: 'System', icon: 'computer' }
  ];

  close(): void {
    this.audioService.playClick();
    this.settingsService.toggleHelp();
  }

  setTheme(mode: ThemeMode): void {
    this.audioService.playClick();
    this.settingsService.setTheme(mode);
  }

  toggleSound(): void {
    this.settingsService.toggleSound();
    if (this.settingsService.soundEnabled()) {
      this.audioService.playSuccess();
    }
  }

  resetStats(): void {
    this.audioService.playClick();
    if (confirm('Are you sure you want to reset all statistics?')) {
      this.statsService.resetStats();
      this.audioService.playSuccess();
    }
  }
}
