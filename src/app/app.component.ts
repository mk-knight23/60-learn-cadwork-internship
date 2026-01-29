import { Component, inject, effect, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsService } from './core/services/settings.service';
import { KeyboardService } from './core/services/keyboard.service';

/**
 * Root Application Component
 * 
 * This component serves as the application shell. The layout is handled
 * by the LayoutComponent which wraps all routed content.
 * 
 * Design Decision: We use a separate LayoutComponent rather than
 * embedding the layout here to keep the root component focused on
 * application-level concerns (theme, keyboard shortcuts, etc.)
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<router-outlet></router-outlet>`,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  private settingsService = inject(SettingsService);
  private keyboardService = inject(KeyboardService);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Apply theme on initialization
    if (isPlatformBrowser(this.platformId)) {
      this.applyTheme();
    }

    // React to theme changes
    effect(() => {
      const isDark = this.settingsService.isDarkMode();
      if (isPlatformBrowser(this.platformId)) {
        this.updateThemeClass(isDark);
      }
    });

    // Handle keyboard actions
    effect(() => {
      const action = this.keyboardService.lastAction();
      if (action !== 'none') {
        this.handleKeyboardAction(action);
      }
    });
  }

  private applyTheme(): void {
    const isDark = this.settingsService.isDarkMode();
    this.updateThemeClass(isDark);
  }

  private updateThemeClass(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }

  private handleKeyboardAction(action: string): void {
    switch (action) {
      case 'help':
        this.settingsService.toggleHelp();
        break;
      case 'close':
        if (this.settingsService.showHelp()) {
          this.settingsService.toggleHelp();
        }
        break;
    }
  }
}
