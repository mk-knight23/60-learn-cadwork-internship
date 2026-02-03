import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';

export interface Note {
  id: string;
  user_id: string;
  task_id: string | null;
  lesson_id: string | null;
  title: string;
  content: string | null;
  category: string;
  tags: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteCreate {
  user_id: string;
  task_id?: string | null;
  lesson_id?: string | null;
  title: string;
  content?: string | null;
  category?: string;
  tags?: string[] | null;
  is_pinned?: boolean;
}

export interface NoteFilters {
  task_id?: string;
  lesson_id?: string;
  category?: string | null;
  search?: string;
  tags?: string[];
  is_pinned?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotesRepository {
  private db = inject(DatabaseService);

  async getAllNotes(userId: string, filters?: NoteFilters): Promise<Note[]> {
    let query = 'SELECT * FROM notes WHERE user_id = ?';
    const params: any[] = [userId];
    const conditions: string[] = [];

    if (filters) {
      if (filters.task_id) {
        conditions.push('task_id = ?');
        params.push(filters.task_id);
      }

      if (filters.lesson_id) {
        conditions.push('lesson_id = ?');
        params.push(filters.lesson_id);
      }

      if (filters.category) {
        conditions.push('category = ?');
        params.push(filters.category);
      }

      if (filters.search) {
        conditions.push('(title LIKE ? OR content LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      if (filters.tags && filters.tags.length > 0) {
        const tagConditions = filters.tags.map(() => 'tags LIKE ?');
        conditions.push(`(${tagConditions.join(' OR ')})`);
        filters.tags.forEach((tag) => {
          params.push(`%${tag}%`);
        });
      }

      if (filters.is_pinned !== undefined) {
        conditions.push('is_pinned = ?');
        params.push(filters.is_pinned ? 1 : 0);
      }
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    query += ' ORDER BY is_pinned DESC, updated_at DESC';

    return this.db.query<Note>(query, params);
  }

  async getNoteById(id: string): Promise<Note | null> {
    return this.db.findById<Note>('notes', id);
  }

  async createNote(note: NoteCreate): Promise<Note> {
    const id = this.db.generateId();
    const now = new Date().toISOString();
    const newNote: Note = {
      id,
      user_id: note.user_id,
      task_id: note.task_id || null,
      lesson_id: note.lesson_id || null,
      title: note.title,
      content: note.content || null,
      category: note.category || 'general',
      tags: note.tags ? note.tags.join(',') : null,
      is_pinned: note.is_pinned || false,
      created_at: now,
      updated_at: now
    };

    this.db.insert('notes', newNote);
    await this.db.save();

    return newNote;
  }

  async updateNote(
    id: string,
    updates: Partial<Omit<Note, 'id' | 'user_id' | 'created_at' | 'tags'>> & { tags?: string[] }
  ): Promise<Note> {
    const tagsAsString = 'tags' in updates && updates.tags ? updates.tags.join(',') : undefined;
    const updatedData = {
      ...updates,
      tags: tagsAsString,
      updated_at: new Date().toISOString()
    } as Partial<Note>;

    await this.db.update('notes', id, updatedData);
    await this.db.save();

    const note = await this.db.findById<Note>('notes', id);
    if (!note) {
      throw new Error('Note not found after update');
    }
    return note;
  }

  async deleteNote(id: string): Promise<void> {
    await this.db.delete('notes', id);
    await this.db.save();
  }

  async togglePin(id: string): Promise<Note> {
    const note = await this.getNoteById(id);
    if (!note) {
      throw new Error('Note not found');
    }

    return this.updateNote(id, { is_pinned: !note.is_pinned });
  }

  async getNotesByTask(taskId: string, userId: string): Promise<Note[]> {
    return this.getAllNotes(userId, { task_id: taskId });
  }

  async getNotesByLesson(lessonId: string, userId: string): Promise<Note[]> {
    return this.getAllNotes(userId, { lesson_id: lessonId });
  }

  async getNotesByCategory(category: string, userId: string): Promise<Note[]> {
    return this.getAllNotes(userId, { category });
  }

  async getPinnedNotes(userId: string): Promise<Note[]> {
    return this.getAllNotes(userId, { is_pinned: true });
  }

  async searchNotes(query: string, userId: string): Promise<Note[]> {
    return this.getAllNotes(userId, { search: query });
  }

  async getAllCategories(userId: string): Promise<string[]> {
    const notes = await this.db.query<Note>('notes', { user_id: userId });
    const categories = new Set(notes.map(n => n.category));
    return Array.from(categories).sort();
  }

  async getAllTags(userId: string): Promise<string[]> {
    const notes = await this.getAllNotes(userId);
    const tagSet = new Set<string>();

    for (const note of notes) {
      if (note.tags) {
        note.tags.split(',').forEach((tag) => tagSet.add(tag.trim()));
      }
    }

    return Array.from(tagSet).sort();
  }
}
