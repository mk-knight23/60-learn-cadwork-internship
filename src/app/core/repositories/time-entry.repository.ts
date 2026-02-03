import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';

export interface TimeEntry {
  id: string;
  task_id: string | null;
  user_id: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  billable: boolean;
  created_at: string;
}

export interface TimeEntryCreate {
  task_id?: string | null;
  user_id: string;
  description?: string | null;
  start_time: string;
  end_time?: string | null;
  billable?: boolean;
}

export interface TimeSummary {
  totalHours: number;
  billableHours: number;
  byTask: Array<{ task_id: string; task_title: string; hours: number }>;
  byDay: Array<{ date: string; hours: number }>;
  thisWeek: number;
  thisMonth: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimeEntryRepository {
  private db = inject(DatabaseService);

  async getAllTimeEntries(userId?: string): Promise<TimeEntry[]> {
    if (userId) {
      return this.db.query<TimeEntry>(
        'SELECT * FROM time_entries WHERE user_id = ? ORDER BY start_time DESC',
        [userId]
      );
    }
    return this.db.findAll<TimeEntry>('time_entries');
  }

  async getTimeEntryById(id: string): Promise<TimeEntry | null> {
    return this.db.findById<TimeEntry>('time_entries', id);
  }

  async createTimeEntry(entry: TimeEntryCreate): Promise<TimeEntry> {
    const id = this.db.generateId();
    const duration = entry.end_time
      ? new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime()
      : null;

    const newEntry: TimeEntry = {
      id,
      task_id: entry.task_id || null,
      user_id: entry.user_id,
      description: entry.description || null,
      start_time: entry.start_time,
      end_time: entry.end_time || null,
      duration: duration ? Math.round(duration / 1000) : null,
      billable: entry.billable || false,
      created_at: new Date().toISOString()
    };

    this.db.insert('time_entries', newEntry);
    await this.db.save();

    return newEntry;
  }

  async updateTimeEntry(
    id: string,
    updates: Partial<Omit<TimeEntry, 'id' | 'user_id' | 'created_at'>>
  ): Promise<TimeEntry> {
    const duration =
      updates.end_time && updates.start_time
        ? new Date(updates.end_time).getTime() - new Date(updates.start_time).getTime()
        : undefined;

    const updatedData = {
      ...updates,
      ...(duration !== undefined ? { duration: Math.round(duration / 1000) } : {})
    };

    await this.db.update('time_entries', id, updatedData);
    await this.db.save();

    const result = await this.db.findById<TimeEntry>('time_entries', id);
    if (!result) {
      throw new Error('Time entry not found after update');
    }
    return result;
  }

  async deleteTimeEntry(id: string): Promise<void> {
    this.db.delete('time_entries', id);
    await this.db.save();
  }

  async getActiveTimeEntry(userId: string): Promise<TimeEntry | null> {
    const results = await this.db.query<TimeEntry>(
      'SELECT * FROM time_entries WHERE user_id = ? AND end_time IS NULL ORDER BY start_time DESC LIMIT 1',
      [userId]
    );
    return results.length > 0 ? results[0] : null;
  }

  async startTimeEntry(
    userId: string,
    taskId: string | null,
    description?: string
  ): Promise<TimeEntry> {
    const activeEntry = await this.getActiveTimeEntry(userId);
    if (activeEntry) {
      await this.stopTimeEntry(activeEntry.id);
    }

    return this.createTimeEntry({
      user_id: userId,
      task_id: taskId,
      description: description || null,
      start_time: new Date().toISOString()
    });
  }

  async stopTimeEntry(id: string): Promise<TimeEntry> {
    const entry = await this.getTimeEntryById(id);
    if (!entry) {
      throw new Error('Time entry not found');
    }

    const endTime = new Date().toISOString();
    const duration = new Date(endTime).getTime() - new Date(entry.start_time).getTime();

    return this.updateTimeEntry(id, {
      end_time: endTime,
      duration: Math.round(duration / 1000)
    });
  }

  async getTimeEntriesByTask(taskId: string): Promise<TimeEntry[]> {
    return this.db.query<TimeEntry>(
      'SELECT * FROM time_entries WHERE task_id = ? ORDER BY start_time DESC',
      [taskId]
    );
  }

  async getTimeEntriesByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TimeEntry[]> {
    return this.db.query<TimeEntry>(
      `SELECT * FROM time_entries
       WHERE user_id = ? AND start_time >= ? AND start_time <= ?
       ORDER BY start_time DESC`,
      [userId, startDate.toISOString(), endDate.toISOString()]
    );
  }

  async getTimeSummary(userId: string, days = 30): Promise<TimeSummary> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await this.getTimeEntriesByDateRange(userId, startDate, endDate);

    let totalHours = 0;
    let billableHours = 0;
    const byTask = new Map<string, { title: string; hours: number }>();
    const byDay = new Map<string, number>();

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date();
    monthStart.setDate(1);

    let thisWeek = 0;
    let thisMonth = 0;

    for (const entry of entries) {
      const hours = (entry.duration || 0) / 3600;
      totalHours += hours;

      if (entry.billable) {
        billableHours += hours;
      }

      // Track by task
      if (entry.task_id) {
        const task = await this.db.findById<any>('tasks', entry.task_id);
        if (task) {
          const existing = byTask.get(entry.task_id) || { title: task.title, hours: 0 };
          byTask.set(entry.task_id, { title: existing.title, hours: existing.hours + hours });
        }
      }

      // Track by day
      const day = entry.start_time.split('T')[0];
      byDay.set(day, (byDay.get(day) || 0) + hours);

      // Track this week
      if (new Date(entry.start_time) >= weekStart) {
        thisWeek += hours;
      }

      // Track this month
      if (new Date(entry.start_time) >= monthStart) {
        thisMonth += hours;
      }
    }

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      billableHours: Math.round(billableHours * 100) / 100,
      byTask: Array.from(byTask.entries()).map(([id, data]) => ({
        task_id: id,
        task_title: data.title,
        hours: Math.round(data.hours * 100) / 100
      })),
      byDay: Array.from(byDay.entries())
        .map(([date, hours]) => ({ date, hours: Math.round(hours * 100) / 100 }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      thisWeek: Math.round(thisWeek * 100) / 100,
      thisMonth: Math.round(thisMonth * 100) / 100
    };
  }

  async getTodayTimeEntries(userId: string): Promise<TimeEntry[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getTimeEntriesByDateRange(userId, today, tomorrow);
  }

  async updateTaskActualHours(taskId: string): Promise<void> {
    const entries = await this.getTimeEntriesByTask(taskId);
    const totalSeconds = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
    const totalHours = Math.round(totalSeconds / 3600);

    const task = await this.db.findById<any>('tasks', taskId);
    if (task) {
      await this.db.update('tasks', taskId, { actual_hours: totalHours });
      await this.db.save();
    }
  }
}
