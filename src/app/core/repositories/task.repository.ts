import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';

export interface Task {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id: string | null;
  due_date: string | null;
  estimated_hours: number | null;
  actual_hours: number;
  position: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface TaskFilters {
  project_id?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  assignee_id?: string;
  search?: string;
  due_before?: string;
  due_after?: string;
}

export interface TaskStats {
  total: number;
  byStatus: Record<Task['status'], number>;
  byPriority: Record<Task['priority'], number>;
  totalEstimated: number;
  totalActual: number;
  completedThisWeek: number;
  overdue: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskRepository {
  private db = inject(DatabaseService);

  async getAllTasks(filters?: TaskFilters): Promise<Task[]> {
    let query = 'SELECT * FROM tasks';
    const params: any[] = [];
    const conditions: string[] = [];

    if (filters) {
      if (filters.project_id) {
        conditions.push('project_id = ?');
        params.push(filters.project_id);
      }

      if (filters.status) {
        conditions.push('status = ?');
        params.push(filters.status);
      }

      if (filters.priority) {
        conditions.push('priority = ?');
        params.push(filters.priority);
      }

      if (filters.assignee_id) {
        conditions.push('assignee_id = ?');
        params.push(filters.assignee_id);
      }

      if (filters.search) {
        conditions.push('(title LIKE ? OR description LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      if (filters.due_before) {
        conditions.push('due_date <= ?');
        params.push(filters.due_before);
      }

      if (filters.due_after) {
        conditions.push('due_date >= ?');
        params.push(filters.due_after);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
    }

    query += ' ORDER BY position ASC, created_at DESC';

    return this.db.query<Task>(query, params);
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.db.findById<Task>('tasks', id);
  }

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>): Promise<Task> {
    const id = this.db.generateId();
    const now = new Date().toISOString();
    const newTask: Task = {
      id,
      ...task,
      created_at: now,
      updated_at: now,
      completed_at: null
    };

    this.db.insert('tasks', newTask);
    await this.logActivity('task_created', 'task', id, { title: task.title });
    await this.db.save();

    return newTask;
  }

  async updateTask(
    id: string,
    updates: Partial<Omit<Task, 'id' | 'created_at'>> & { completed_at?: string | null }
  ): Promise<Task> {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    await this.db.update('tasks', id, updatedData);

    const task = await this.getTaskById(id);
    if (task) {
      await this.logActivity('task_updated', 'task', id, {
        title: task.title,
        status: updates.status || task.status
      });
    }

    await this.db.save();
    const updatedTask = await this.db.findById<Task>('tasks', id);
    if (!updatedTask) {
      throw new Error('Task not found after update');
    }
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.getTaskById(id);
    await this.db.delete('tasks', id);

    if (task) {
      await this.logActivity('task_deleted', 'task', id, { title: task.title });
    }

    await this.db.save();
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return this.getAllTasks({ project_id: projectId });
  }

  async getTasksByStatus(status: Task['status']): Promise<Task[]> {
    return this.getAllTasks({ status });
  }

  async getTasksByAssignee(assigneeId: string): Promise<Task[]> {
    return this.getAllTasks({ assignee_id: assigneeId });
  }

  async updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
    const updates: Partial<Task> = { status };

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    } else {
      updates.completed_at = null;
    }

    return this.updateTask(id, updates);
  }

  async getTaskStats(filters?: TaskFilters): Promise<TaskStats> {
    const tasks = await this.getAllTasks(filters);

    const byStatus: Record<Task['status'], number> = {
      todo: 0,
      in_progress: 0,
      review: 0,
      completed: 0,
      cancelled: 0
    };

    const byPriority: Record<Task['priority'], number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };

    let totalEstimated = 0;
    let totalActual = 0;
    let completedThisWeek = 0;
    let overdue = 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const today = new Date();

    for (const task of tasks) {
      byStatus[task.status]++;
      byPriority[task.priority]++;

      if (task.estimated_hours) totalEstimated += task.estimated_hours;
      if (task.actual_hours) totalActual += task.actual_hours;

      if (
        task.status === 'completed' &&
        task.completed_at &&
        new Date(task.completed_at) > oneWeekAgo
      ) {
        completedThisWeek++;
      }

      if (
        task.status !== 'completed' &&
        task.due_date &&
        new Date(task.due_date) < today
      ) {
        overdue++;
      }
    }

    return {
      total: tasks.length,
      byStatus,
      byPriority,
      totalEstimated,
      totalActual,
      completedThisWeek,
      overdue
    };
  }

  async searchTasks(query: string): Promise<Task[]> {
    return this.getAllTasks({ search: query });
  }

  private async logActivity(action: string, entityType: string, entityId: string, details: any): Promise<void> {
    const users = await this.db.findAll<any>('users');
    const userId = users.length > 0 ? users[0].id : 'system';

    await this.db.insert('activity_log', {
      id: this.db.generateId(),
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: JSON.stringify(details),
      timestamp: new Date().toISOString()
    });
  }
}
