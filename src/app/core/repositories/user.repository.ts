import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Observable, BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  notifications_enabled: boolean;
  daily_goal_hours: number;
  week_start_day: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserRepository {
  private db = inject(DatabaseService);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUserSubject.value) {
      return this.currentUserSubject.value;
    }

    const users = await this.db.findAll<User>('users');
    if (users.length > 0) {
      this.currentUserSubject.next(users[0]);
      return users[0];
    }

    return null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.db.findById<User>('users', id);
  }

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const id = this.db.generateId();
    const now = new Date().toISOString();
    const newUser: User = {
      id,
      ...user,
      created_at: now,
      updated_at: now
    };

    this.db.insert('users', newUser);
    await this.db.save();

    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const updatedUser = { ...updates, updated_at: new Date().toISOString() };
    await this.db.update('users', id, updatedUser);
    await this.db.save();

    // Update current user if it's the same
    const currentUser = this.currentUserSubject.value;
    if (currentUser && currentUser.id === id) {
      const updated = { ...currentUser, ...updatedUser } as User;
      this.currentUserSubject.next(updated);
    }

    const result = await this.db.findById<User>('users', id);
    if (!result) {
      throw new Error('User not found after update');
    }
    return result;
  }

  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const settings = await this.db.query<UserSettings>(
      'SELECT * FROM settings WHERE user_id = ?',
      [userId]
    );
    return settings.length > 0 ? settings[0] : null;
  }

  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
    const existing = await this.getUserSettings(userId);
    const settingsId = existing?.id || this.db.generateId();

    if (existing) {
      await this.db.update('settings', existing.id, updates);
    } else {
      await this.db.insert('settings', {
        id: settingsId,
        user_id: userId,
        theme: 'light',
        notifications_enabled: true,
        daily_goal_hours: 8,
        week_start_day: 'monday',
        ...updates
      });
    }

    await this.db.save();
    const result = await this.db.findById<UserSettings>('settings', settingsId);
    if (!result) {
      throw new Error('Settings not found after update');
    }
    return result;
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.findAll<User>('users');
  }
}
