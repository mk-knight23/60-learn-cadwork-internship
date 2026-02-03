import { Injectable, inject } from '@angular/core';
import { UserRepository, User, UserSettings } from '../repositories/user.repository';
import { signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userRepo = inject(UserRepository);

  // Current user state
  currentUser = signal<User | null>(null);
  currentSettings = signal<UserSettings | null>(null);

  // Computed properties
  theme = computed(() => this.currentSettings()?.theme || 'light');
  dailyGoalHours = computed(() => this.currentSettings()?.daily_goal_hours || 8);
  notificationsEnabled = computed(() => this.currentSettings()?.notifications_enabled ?? true);

  async initialize(): Promise<void> {
    const user = await this.userRepo.getCurrentUser();
    if (user) {
      this.currentUser.set(user);
      const settings = await this.userRepo.getUserSettings(user.id);
      this.currentSettings.set(settings);
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser()) {
      throw new Error('No user logged in');
    }

    const updated = await this.userRepo.updateUser(this.currentUser()!.id, updates);
    this.currentUser.set(updated);
    return updated;
  }

  async updateSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
    if (!this.currentUser()) {
      throw new Error('No user logged in');
    }

    const updated = await this.userRepo.updateUserSettings(this.currentUser()!.id, updates);
    this.currentSettings.set(updated);
    return updated;
  }

  async toggleTheme(): Promise<void> {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    await this.updateSettings({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }

  setTheme(theme: 'light' | 'dark'): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  get initials(): string {
    const user = this.currentUser();
    if (!user || !user.name) return '?';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
