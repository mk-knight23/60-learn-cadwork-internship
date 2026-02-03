import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SettingsService } from '../../core/services/settings.service';
import { StatsService } from '../../core/services/stats.service';
import { ProfileService } from '../../core/services/profile.service';
import { SettingsPanelComponent } from '../dashboard/components/settings-panel.component';

interface NavItem {
  route: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
    SettingsPanelComponent
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav 
        mode="side" 
        opened 
        class="sidenav"
        [class.dark]="settingsService.isDarkMode()">
        
        <div class="sidenav-header">
          <div class="logo-container">
            <span class="logo">CW</span>
          </div>
          <div class="brand">
            <h1 class="title">Cadwork</h1>
            <p class="subtitle">Internship Portal</p>
          </div>
        </div>

        <mat-nav-list class="nav-list">
          @for (item of navItems; track item.route) {
            <a mat-list-item 
               [routerLink]="item.route"
               routerLinkActive="active-link"
               class="nav-item"
               [matTooltip]="item.label"
               matTooltipPosition="right">
              <mat-icon matListItemIcon class="nav-icon">{{ item.icon }}</mat-icon>
              <span matListItemTitle class="nav-label">{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>

        <div class="storage-card">
          <p class="storage-label">Storage Status</p>
          <div class="storage-bar">
            <div class="storage-fill" [style.width.%]="storagePercent()"></div>
          </div>
          <p class="storage-text">{{ storagePercent() }}% of 2GB used</p>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="main-content" [class.dark]="settingsService.isDarkMode()">
        <mat-toolbar class="toolbar" [class.dark]="settingsService.isDarkMode()">
          <div class="toolbar-left">
            <h2 class="page-title">{{ pageTitle() }}</h2>
          </div>
          
          <div class="toolbar-right">
            <div class="stats-summary">
              <span class="stat-item" matTooltip="Projects Viewed">
                <mat-icon>folder_open</mat-icon>
                {{ statsService.totalProjectsViewed() }}
              </span>
              <span class="stat-item" matTooltip="Time Spent">
                <mat-icon>schedule</mat-icon>
                {{ statsService.formatTime() }}
              </span>
            </div>

            <button 
              mat-icon-button 
              class="settings-button"
              (click)="openSettings()"
              matTooltip="Settings">
              <mat-icon>settings</mat-icon>
            </button>
          </div>
        </mat-toolbar>

        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <app-settings-panel></app-settings-panel>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
    
    .layout-container { height: 100%; }

    .sidenav {
      width: 260px;
      background: linear-gradient(180deg, #312E81 0%, #1E1B4B 100%);
      border-right: none;
      padding: 24px 20px 24px 24px;
      display: flex;
      flex-direction: column;
    }

    .sidenav-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo-container {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .logo {
      color: white;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 18px;
      font-style: italic;
    }

    .brand { display: flex; flex-direction: column; }

    .title {
      color: white;
      font-size: 18px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.02em;
      text-transform: uppercase;
    }

    .subtitle {
      color: #64748B;
      font-size: 10px;
      font-weight: 700;
      margin: 2px 0 0 0;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .nav-list { padding: 0; flex: 1; }

    .nav-item {
      color: #94A3B8;
      border-radius: 10px;
      margin-bottom: 4px;
      transition: all 0.2s ease;
      height: 44px;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: #F8FAFC;
    }

    .nav-item.active-link {
      background: rgba(99, 102, 241, 0.2);
      color: #A5B4FC;
      border-left: 3px solid #818CF8;
      margin-left: -3px;
      box-shadow: 0 0 12px rgba(129, 140, 248, 0.2);
    }

    .nav-icon { color: inherit; }
    .nav-label { font-size: 14px; font-weight: 600; }

    .storage-card {
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 16px;
      margin-top: auto;
    }

    .storage-label {
      color: #64748B;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0 0 12px 0;
    }

    .storage-bar {
      height: 4px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
    }

    .storage-fill {
      height: 100%;
      background: linear-gradient(90deg, #4F46E5 0%, #818CF8 100%);
      border-radius: 2px;
      transition: width 0.3s ease;
      box-shadow: 0 0 8px rgba(79, 70, 229, 0.4);
    }

    .storage-text {
      color: #94A3B8;
      font-size: 11px;
      font-weight: 600;
      margin: 8px 0 0 0;
    }

    .main-content {
      background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
      display: flex;
      flex-direction: column;
    }

    .main-content.dark { background-color: #0F172A; }

    .toolbar {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(129, 140, 248, 0.2);
      height: 72px;
      padding: 0 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.08);
    }

    .toolbar.dark {
      background: rgba(30, 41, 59, 0.8);
      border-bottom-color: rgba(129, 140, 248, 0.2);
    }

    .page-title {
      font-size: 20px;
      font-weight: 700;
      color: #312E81;
      margin: 0;
    }

    .toolbar.dark .page-title { color: #E0E7FF; }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stats-summary {
      display: flex;
      gap: 16px;
      padding-right: 16px;
      border-right: 1px solid #E2E8F0;
    }

    .toolbar.dark .stats-summary { border-right-color: #1E293B; }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #64748B;
      font-size: 13px;
      font-weight: 600;
    }

    .stat-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #94A3B8;
    }

    .settings-button { color: #64748B; }
    .toolbar.dark .settings-button { color: #94A3B8; }

    .content-area {
      flex: 1;
      padding: 32px;
      overflow-y: auto;
    }
  `]
})
export class LayoutComponent {
  settingsService = inject(SettingsService);
  statsService = inject(StatsService);
  private router = inject(Router);
  private profileService = inject(ProfileService);

  constructor() {
    // Initialize profile service
    this.profileService.initialize();
  }

  navItems: NavItem[] = [
    { route: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { route: '/projects', label: 'Projects', icon: 'folder' },
    { route: '/lessons', label: 'Lessons', icon: 'school' },
    { route: '/skills', label: 'Skills', icon: 'psychology' },
    { route: '/time-log', label: 'Time Log', icon: 'schedule' },
    { route: '/notes', label: 'Notes', icon: 'sticky_note_2' },
    { route: '/analytics', label: 'Analytics', icon: 'bar_chart' },
    { route: '/settings', label: 'Settings', icon: 'settings' }
  ];

  pageTitle = computed(() => {
    const url = this.router.url;
    const item = this.navItems.find(i => url.startsWith(i.route));
    return item?.label ?? 'Cadwork Internship';
  });

  storagePercent = computed(() => 65);

  openSettings(): void {
    this.settingsService.toggleHelp();
  }
}
