import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { STORAGE_KEYS } from '../utils/constants';

interface Stats {
  totalProjectsViewed: number;
  totalTasksCompleted: number;
  lastVisit: string | null;
  totalTimeSpent: number;
}

const defaultStats: Stats = {
  totalProjectsViewed: 0,
  totalTasksCompleted: 0,
  lastVisit: null,
  totalTimeSpent: 0,
};

@Injectable({ providedIn: 'root' })
export class StatsService {
  private platformId = inject(PLATFORM_ID);

  private _totalProjectsViewed = signal<number>(0);
  private _totalTasksCompleted = signal<number>(0);
  private _totalTimeSpent = signal<number>(0);
  private _lastVisit = signal<string | null>(null);

  readonly totalProjectsViewed = this._totalProjectsViewed.asReadonly();
  readonly totalTasksCompleted = this._totalTasksCompleted.asReadonly();
  readonly totalTimeSpent = this._totalTimeSpent.asReadonly();
  readonly lastVisit = this._lastVisit.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS);
      if (stored) {
        const data = JSON.parse(stored);
        this._totalProjectsViewed.set(data.totalProjectsViewed ?? 0);
        this._totalTasksCompleted.set(data.totalTasksCompleted ?? 0);
        this._totalTimeSpent.set(data.totalTimeSpent ?? 0);
        this._lastVisit.set(data.lastVisit ?? null);
      }
    } catch {
      console.warn('Failed to load stats');
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.STATS,
        JSON.stringify({
          totalProjectsViewed: this._totalProjectsViewed(),
          totalTasksCompleted: this._totalTasksCompleted(),
          totalTimeSpent: this._totalTimeSpent(),
          lastVisit: this._lastVisit(),
        })
      );
    } catch {
      console.warn('Failed to save stats');
    }
  }

  recordProjectView(): void {
    this._totalProjectsViewed.update(v => v + 1);
    this._lastVisit.set(new Date().toISOString());
    this.saveToStorage();
  }

  recordTaskCompleted(): void {
    this._totalTasksCompleted.update(v => v + 1);
    this.saveToStorage();
  }

  addTimeSpent(seconds: number): void {
    this._totalTimeSpent.update(v => v + seconds);
    this.saveToStorage();
  }

  resetStats(): void {
    this._totalProjectsViewed.set(0);
    this._totalTasksCompleted.set(0);
    this._totalTimeSpent.set(0);
    this._lastVisit.set(null);
    this.saveToStorage();
  }

  formatTime(): string {
    const seconds = this._totalTimeSpent();
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}
