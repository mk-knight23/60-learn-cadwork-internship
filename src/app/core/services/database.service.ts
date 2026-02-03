import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';

interface TableSchema {
  name: string;
  indexes: { name: string; keyPath: string }[];
}

// Browser-compatible database using IndexedDB
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db!: IDBDatabase;
  private readonly DB_NAME = 'cadwork_internship_db';
  private readonly DB_VERSION = 1;

  private schemas: TableSchema[] = [
    { name: 'users', indexes: [{ name: 'idx_email', keyPath: 'email' }] },
    { name: 'settings', indexes: [{ name: 'idx_user', keyPath: 'user_id' }] },
    { name: 'projects', indexes: [
      { name: 'idx_status', keyPath: 'status' },
      { name: 'idx_priority', keyPath: 'priority' }
    ]},
    { name: 'tasks', indexes: [
      { name: 'idx_project', keyPath: 'project_id' },
      { name: 'idx_status', keyPath: 'status' },
      { name: 'idx_assignee', keyPath: 'assignee_id' }
    ]},
    { name: 'time_entries', indexes: [
      { name: 'idx_task', keyPath: 'task_id' },
      { name: 'idx_user', keyPath: 'user_id' },
      { name: 'idx_start_time', keyPath: 'start_time' }
    ]},
    { name: 'notes', indexes: [
      { name: 'idx_user', keyPath: 'user_id' },
      { name: 'idx_task', keyPath: 'task_id' },
      { name: 'idx_lesson', keyPath: 'lesson_id' },
      { name: 'idx_category', keyPath: 'category' }
    ]},
    { name: 'lessons', indexes: [
      { name: 'idx_category', keyPath: 'category' },
      { name: 'idx_difficulty', keyPath: 'difficulty' }
    ]},
    { name: 'lesson_progress', indexes: [
      { name: 'idx_user', keyPath: 'user_id' },
      { name: 'idx_lesson', keyPath: 'lesson_id' }
    ]},
    { name: 'skills', indexes: [
      { name: 'idx_category', keyPath: 'category' }
    ]},
    { name: 'skill_progress', indexes: [
      { name: 'idx_user', keyPath: 'user_id' },
      { name: 'idx_skill', keyPath: 'skill_id' }
    ]},
    { name: 'activity_log', indexes: [
      { name: 'idx_user', keyPath: 'user_id' },
      { name: 'idx_timestamp', keyPath: 'timestamp' }
    ]}
  ];

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.seedInitialData().then(() => resolve()).catch(reject);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create all object stores
        this.schemas.forEach(schema => {
          if (!db.objectStoreNames.contains(schema.name)) {
            const store = db.createObjectStore(schema.name, { keyPath: 'id' });
            schema.indexes.forEach(idx => {
              store.createIndex(idx.name, idx.keyPath, { unique: false });
            });
          }
        });
      };
    });
  }

  // Generic query methods - simulating SQL-like queries
  async getAll<T = any>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  async get<T = any>(storeName: string, id: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T = any>(storeName: string, data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Query with index
  async getAllByIndex<T = any>(storeName: string, indexName: string, value: any): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  // Complex query simulation - filters array of objects
  query<T = any>(storeName: string, filters?: { [key: string]: any }): Promise<T[]> {
    return this.getAll<T>(storeName).then(results => {
      if (!filters) return results;

      return results.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          const itemValue = (item as any)[key];
          if (typeof value === 'string' && value.includes('%')) {
            // LIKE simulation
            const pattern = value.replace(/%/g, '.*');
            return new RegExp(pattern, 'i').test(itemValue);
          }
          return itemValue === value;
        });
      });
    });
  }

  // SQL-like run method (for INSERT/UPDATE/DELETE simulation)
  async run(storeName: string, operation: 'put' | 'delete', data: any): Promise<void> {
    if (operation === 'put') {
      return this.put(storeName, data);
    } else if (operation === 'delete') {
      return this.delete(storeName, data.id || data);
    }
  }

  // Generate unique ID
  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Find by ID
  async findById<T = any>(storeName: string, id: string): Promise<T | null> {
    return this.get<T>(storeName, id);
  }

  // Find all with optional filters
  async findAll<T = any>(storeName: string, filters?: { [key: string]: any }): Promise<T[]> {
    return this.query<T>(storeName, filters);
  }

  // Insert
  async insert(storeName: string, data: any): Promise<void> {
    return this.put(storeName, data);
  }

  // Update
  async update(storeName: string, id: string, data: Partial<any>): Promise<void> {
    const existing = await this.get(storeName, id);
    if (existing) {
      return this.put(storeName, { ...existing, ...data });
    }
  }

  // Custom query for complex operations
  async exec<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    // Parse simple SQL queries and convert to IndexedDB operations
    // This is a simplified version - in production you'd use a proper SQL parser

    const selectMatch = sql.match(/SELECT\s+\*\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
    if (selectMatch) {
      const [, storeName, whereClause] = selectMatch;

      if (whereClause) {
        // Parse WHERE clause (simplified)
        const conditions = whereClause.split('AND').map(c => c.trim());
        const filters: { [key: string]: any } = {};

        for (const condition of conditions) {
          const match = condition.match(/(\w+)\s*=?\s*(.+)?/i);
          if (match) {
            const [, key, value] = match;
            const cleanValue = value?.replace(/['"]/g, '') || params[0];
            filters[key] = cleanValue;
          }
        }

        return this.query<T>(storeName, filters);
      }

      return this.getAll<T>(storeName);
    }

    return [];
  }

  async save(): Promise<void> {
    // IndexedDB auto-saves, but we can keep this for compatibility
    return Promise.resolve();
  }

  async reset(): Promise<void> {
    // Close and delete database
    this.db.close();
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Reinitialize
    await this.initialize();
  }

  private async seedInitialData(): Promise<void> {
    // Seed default user
    const users = await this.getAll<any>('users');
    if (users.length === 0) {
      await this.put('users', {
        id: 'user-1',
        name: 'Intern Developer',
        email: 'intern@cadwork.example',
        role: 'intern',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Seed default settings
      await this.put('settings', {
        id: 'settings-1',
        user_id: 'user-1',
        theme: 'light',
        notifications_enabled: true,
        daily_goal_hours: 8,
        week_start_day: 'monday'
      });

      // Seed sample projects
      const projects = [
        {
          id: 'proj-1',
          title: 'Hydraulic System Blueprinting',
          description: 'Comprehensive CAD documentation for hydraulic systems including pressure analysis and flow diagrams.',
          status: 'ongoing',
          priority: 'high',
          start_date: '2026-01-15',
          due_date: '2026-02-28',
          progress: 65,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'proj-2',
          title: 'Automated CAD Validation Engine',
          description: 'Automated validation pipeline for CAD files ensuring compliance with engineering standards.',
          status: 'review',
          priority: 'high',
          start_date: '2026-02-02',
          due_date: '2026-02-15',
          progress: 92,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'proj-3',
          title: 'Turbine Optimization Report',
          description: 'Analysis and optimization report for industrial turbine performance metrics.',
          status: 'completed',
          priority: 'medium',
          start_date: '2025-12-10',
          due_date: '2026-01-15',
          progress: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'proj-4',
          title: 'Material Stress Simulation',
          description: 'Finite element analysis simulation for new composite materials under load.',
          status: 'draft',
          priority: 'low',
          start_date: '2026-02-10',
          due_date: '2026-03-30',
          progress: 12,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      for (const project of projects) {
        await this.put('projects', project);
      }

      // Seed sample tasks
      const tasks = [
        {
          id: 'task-1',
          project_id: 'proj-1',
          title: 'Design pressure analysis module',
          description: 'Create detailed pressure analysis calculations',
          status: 'completed',
          priority: 'high',
          assignee_id: 'user-1',
          due_date: '2026-01-20',
          estimated_hours: 8,
          actual_hours: 8,
          position: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        },
        {
          id: 'task-2',
          project_id: 'proj-1',
          title: 'Implement flow diagram generator',
          description: 'Build automated flow diagram creation tool',
          status: 'ongoing',
          priority: 'high',
          assignee_id: 'user-1',
          due_date: '2026-02-05',
          estimated_hours: 16,
          actual_hours: 6,
          position: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: null
        },
        {
          id: 'task-3',
          project_id: 'proj-1',
          title: 'Documentation review',
          description: 'Review and approve all technical documentation',
          status: 'todo',
          priority: 'medium',
          assignee_id: 'user-1',
          due_date: '2026-02-25',
          estimated_hours: 4,
          actual_hours: 0,
          position: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: null
        },
        {
          id: 'task-4',
          project_id: 'proj-2',
          title: 'Validation rule engine',
          description: 'Implement core validation logic',
          status: 'completed',
          priority: 'high',
          assignee_id: 'user-1',
          due_date: '2026-02-08',
          estimated_hours: 20,
          actual_hours: 18,
          position: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        },
        {
          id: 'task-5',
          project_id: 'proj-2',
          title: 'Error reporting system',
          description: 'Build user-friendly error display',
          status: 'review',
          priority: 'medium',
          assignee_id: 'user-1',
          due_date: '2026-02-12',
          estimated_hours: 6,
          actual_hours: 5,
          position: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: null
        },
        {
          id: 'task-6',
          project_id: 'proj-3',
          title: 'Performance data collection',
          description: 'Gather turbine performance metrics',
          status: 'completed',
          priority: 'high',
          assignee_id: 'user-1',
          due_date: '2025-12-20',
          estimated_hours: 12,
          actual_hours: 12,
          position: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        },
        {
          id: 'task-7',
          project_id: 'proj-4',
          title: 'Material properties database',
          description: 'Research and catalog composite materials',
          status: 'ongoing',
          priority: 'medium',
          assignee_id: 'user-1',
          due_date: '2026-02-20',
          estimated_hours: 10,
          actual_hours: 3,
          position: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: null
        }
      ];

      for (const task of tasks) {
        await this.put('tasks', task);
      }

      // Seed sample lessons
      const lessons = [
        {
          id: 'lesson-1',
          title: 'Angular Components',
          category: 'fundamentals',
          content: 'Understanding standalone components, lifecycle hooks, and component communication patterns.',
          duration_minutes: 45,
          difficulty: 'beginner',
          order_index: 0,
          completed: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'lesson-2',
          title: 'Services & Dependency Injection',
          category: 'fundamentals',
          content: 'Creating reusable services with providedIn and the DI system.',
          duration_minutes: 60,
          difficulty: 'beginner',
          order_index: 1,
          completed: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'lesson-3',
          title: 'Reactive Programming with RxJS',
          category: 'patterns',
          content: 'Observables, operators, and reactive patterns in Angular.',
          duration_minutes: 90,
          difficulty: 'intermediate',
          order_index: 2,
          completed: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'lesson-4',
          title: 'Angular Signals',
          category: 'patterns',
          content: 'Modern reactivity with Angular Signals for fine-grained reactivity.',
          duration_minutes: 50,
          difficulty: 'intermediate',
          order_index: 3,
          completed: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'lesson-5',
          title: 'State Management Patterns',
          category: 'patterns',
          content: 'Enterprise state management using services and signals.',
          duration_minutes: 75,
          difficulty: 'advanced',
          order_index: 4,
          completed: false,
          created_at: new Date().toISOString()
        }
      ];

      for (const lesson of lessons) {
        await this.put('lessons', lesson);
      }

      // Seed sample skills
      const skills = [
        {
          id: 'skill-1',
          name: 'Components',
          category: 'fundamentals',
          description: 'Building reusable Angular components',
          level: 'beginner',
          parent_skill_id: null,
          order_index: 0
        },
        {
          id: 'skill-2',
          name: 'Services',
          category: 'fundamentals',
          description: 'Creating services for business logic',
          level: 'beginner',
          parent_skill_id: null,
          order_index: 1
        },
        {
          id: 'skill-3',
          name: 'Routing',
          category: 'fundamentals',
          description: 'Angular Router and navigation',
          level: 'intermediate',
          parent_skill_id: null,
          order_index: 2
        },
        {
          id: 'skill-4',
          name: 'Forms',
          category: 'fundamentals',
          description: 'Template and reactive forms',
          level: 'intermediate',
          parent_skill_id: null,
          order_index: 3
        },
        {
          id: 'skill-5',
          name: 'RxJS',
          category: 'patterns',
          description: 'Reactive programming patterns',
          level: 'intermediate',
          parent_skill_id: null,
          order_index: 4
        },
        {
          id: 'skill-6',
          name: 'State Management',
          category: 'patterns',
          description: 'Managing application state',
          level: 'advanced',
          parent_skill_id: null,
          order_index: 5
        },
        {
          id: 'skill-7',
          name: 'Testing',
          category: 'fundamentals',
          description: 'Unit and integration testing',
          level: 'intermediate',
          parent_skill_id: null,
          order_index: 6
        }
      ];

      for (const skill of skills) {
        await this.put('skills', skill);
      }
    }
  }
}
