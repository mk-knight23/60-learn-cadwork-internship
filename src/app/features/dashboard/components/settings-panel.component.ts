import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService, ThemeMode } from '../../../core/services/settings.service';
import { StatsService } from '../../../core/services/stats.service';
import { AudioService } from '../../../core/services/audio.service';
import { KeyboardService } from '../../../core/services/keyboard.service';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (settingsService.showHelp()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" (click)="close()">
        <div class="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full" (click)="$event.stopPropagation()">
          <div class="p-8">
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-2xl font-black text-white">Settings</h2>
              <button (click)="close()" class="p-2 rounded-full hover:bg-white/10 transition-colors">
                <span class="text-xl text-white">✕</span>
              </button>
            </div>

            <div class="space-y-6">
              <div class="space-y-3">
                <h3 class="text-sm font-semibold text-slate-400">Theme</h3>
                <div class="flex gap-2">
                  @for (mode of themeModes; track mode.value) {
                    <button
                      (click)="setTheme(mode.value)"
                      [class]="settingsService.theme() === mode.value
                        ? 'bg-cad-blue text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
                      class="flex-1 px-3 py-2 rounded-xl font-medium transition-all"
                    >
                      {{ mode.label }}
                    </button>
                  }
                </div>
              </div>

              <div class="space-y-3">
                <h3 class="text-sm font-semibold text-slate-400">Sound Effects</h3>
                <button
                  (click)="toggleSound()"
                  class="w-full flex items-center justify-between p-4 bg-slate-800 rounded-2xl"
                >
                  <span class="font-medium text-white">Enable Sound</span>
                  <span [class]="settingsService.soundEnabled() ? 'text-cad-green' : 'text-slate-500'">
                    {{ settingsService.soundEnabled() ? '✓' : '✕' }}
                  </span>
                </button>
              </div>

              <div class="space-y-3">
                <h3 class="text-sm font-semibold text-slate-400">Statistics</h3>
                <div class="grid grid-cols-2 gap-3">
                  <div class="p-4 bg-slate-800 rounded-2xl text-center">
                    <div class="text-2xl font-black text-cad-blue">{{ statsService.totalProjectsViewed() }}</div>
                    <div class="text-xs text-slate-500">Projects</div>
                  </div>
                  <div class="p-4 bg-slate-800 rounded-2xl text-center">
                    <div class="text-2xl font-black text-cad-green">{{ statsService.totalTasksCompleted() }}</div>
                    <div class="text-xs text-slate-500">Tasks</div>
                  </div>
                  <div class="p-4 bg-slate-800 rounded-2xl text-center">
                    <div class="text-2xl font-black text-cad-blue">{{ statsService.formatTime() }}</div>
                    <div class="text-xs text-slate-500">Time Spent</div>
                  </div>
                  <div class="p-4 bg-slate-800 rounded-2xl text-center">
                    <div class="text-2xl font-black text-cad-green">{{ statsService.lastVisit() ? 'Yes' : 'No' }}</div>
                    <div class="text-xs text-slate-500">Last Visit</div>
                  </div>
                </div>
                <button
                  (click)="resetStats()"
                  class="w-full p-3 text-red-500 hover:bg-red-900/20 rounded-xl transition-colors font-medium"
                >
                  Reset Statistics
                </button>
              </div>

              <div class="space-y-3">
                <h3 class="text-sm font-semibold text-slate-400">Keyboard Shortcuts</h3>
                <div class="space-y-2">
                  @for (shortcut of keyboardService.getShortcuts(); track shortcut.key) {
                    <div class="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
                      <span class="text-white">{{ shortcut.action }}</span>
                      <kbd class="px-3 py-1 text-sm font-mono bg-slate-700 text-white rounded-lg">{{ shortcut.key }}</kbd>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-slate-700">
              <p class="text-center text-sm text-slate-500">
                Cadwork v1.0.0 • Built with Angular 21
              </p>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }
  `]
})
export class SettingsPanelComponent {
  settingsService = inject(SettingsService);
  statsService = inject(StatsService);
  private audioService = inject(AudioService);
  keyboardService = inject(KeyboardService);

  themeModes: { value: ThemeMode; label: string }[] = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'system', label: 'System' },
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
    this.audioService.playSuccess();
  }

  resetStats(): void {
    this.audioService.playClick();
    if (confirm('Are you sure you want to reset all statistics?')) {
      this.statsService.resetStats();
      this.audioService.playSuccess();
    }
  }
}
