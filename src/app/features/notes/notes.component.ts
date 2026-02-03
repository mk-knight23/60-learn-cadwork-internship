import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { NotesRepository, Note, NoteFilters } from '../../core/repositories';
import { ProfileService } from '../../core/services/profile.service';
import { TaskRepository } from '../../core/repositories';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="notes-container">
      <!-- Header -->
      <header class="notes-header">
        <div>
          <h1 class="notes-title">Notes</h1>
          <p class="notes-subtitle">Your personal knowledge base and annotations</p>
        </div>
        <button mat-fab color="primary" (click)="openNewNote()" matTooltip="Create New Note">
          <mat-icon>add</mat-icon>
        </button>
      </header>

      <!-- Search and Filter Bar -->
      <section class="search-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search notes...</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="filterNotes()" placeholder="Search by title or content" />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="selectedCategory" (selectionChange)="filterNotes()">
            <mat-option [value]="null">All Categories</mat-option>
            @for (category of categories(); track category) {
              <mat-option [value]="category">{{ category }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <button mat-button (click)="togglePinnedOnly()" [class.active]="pinnedOnly()">
          <mat-icon [class.active-icon]="pinnedOnly()">push_pin</mat-icon>
          Pinned Only
        </button>
      </section>

      <!-- Notes Grid -->
      <section class="notes-section">
        @if (loading()) {
          <div class="loading-state">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading notes...</p>
          </div>
        } @else if (filteredNotes().length === 0) {
          <div class="empty-state">
            <mat-icon>sticky_note_2</mat-icon>
            <p>
              @if (searchQuery() || selectedCategory()) {
                No notes match your filters. Try adjusting your search.
              } @else {
                No notes yet. Create your first note to get started!
              }
            </p>
          </div>
        } @else {
          <div class="notes-grid">
            @for (note of filteredNotes(); track note.id) {
              <mat-card class="note-card" [class.pinned]="note.is_pinned">
                <mat-card-header class="note-header">
                  <mat-icon mat-card-avatar class="note-icon">description</mat-icon>
                  <div class="note-header-text">
                    <mat-card-title class="note-title">{{ note.title }}</mat-card-title>
                    <mat-card-subtitle class="note-meta">
                      <span class="note-category">{{ note.category }}</span>
                      <span class="note-date">{{ formatDate(note.updated_at) }}</span>
                    </mat-card-subtitle>
                  </div>
                  <button mat-icon-button class="more-button" [matMenuTriggerFor]="noteMenu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #noteMenu="matMenu">
                    <button mat-menu-item (click)="togglePin(note.id)">
                      <mat-icon>{{ note.is_pinned ? 'push_pin' : 'push_pin' }}</mat-icon>
                      {{ note.is_pinned ? 'Unpin' : 'Pin' }}
                    </button>
                    <button mat-menu-item (click)="editNote(note.id)">
                      <mat-icon>edit</mat-icon>
                      Edit
                    </button>
                    <button mat-menu-item (click)="duplicateNote(note.id)">
                      <mat-icon>content_copy</mat-icon>
                      Duplicate
                    </button>
                    <mat-divider></mat-divider>
                    <button mat-menu-item color="warn" (click)="deleteNote(note.id)">
                      <mat-icon>delete</mat-icon>
                      Delete
                    </button>
                  </mat-menu>
                </mat-card-header>

                <mat-card-content class="note-content">
                  <p class="note-preview">{{ getPreview(note.content) }}</p>

                  @if (note.tags) {
                    <mat-chip-listbox class="note-tags">
                      @for (tag of getTags(note.tags); track tag) {
                        <mat-chip (click)="filterByTag(tag)">{{ tag }}</mat-chip>
                      }
                    </mat-chip-listbox>
                  }

                  @if (note.task_id || note.lesson_id) {
                    <div class="note-link">
                      @if (note.task_id) {
                        <mat-chip-listbox>
                          <mat-chip>
                            <mat-icon>task_alt</mat-icon>
                            Task
                          </mat-chip>
                        </mat-chip-listbox>
                      }
                      @if (note.lesson_id) {
                        <mat-chip-listbox>
                          <mat-chip>
                            <mat-icon>school</mat-icon>
                            Lesson
                          </mat-chip>
                        </mat-chip-listbox>
                      }
                    </div>
                  }
                </mat-card-content>

                <mat-card-actions class="note-actions">
                  <button mat-button (click)="viewNote(note.id)">
                    <mat-icon>visibility</mat-icon>
                    View
                  </button>
                  <button mat-button (click)="editNote(note.id)">
                    <mat-icon>edit</mat-icon>
                    Edit
                  </button>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        }
      </section>

      <!-- Note Editor Dialog (inline for now) -->
      @if (showEditor()) {
        <div class="editor-overlay" (click)="closeEditor()">
          <mat-card class="editor-card" (click)="$event.stopPropagation()">
            <mat-card-header class="editor-header">
              <mat-card-title>
                @if (editingNote()) {
                  Edit Note
                } @else {
                  New Note
                }
              </mat-card-title>
              <button mat-icon-button (click)="closeEditor()">
                <mat-icon>close</mat-icon>
              </button>
            </mat-card-header>

            <mat-card-content class="editor-content">
              <mat-form-field appearance="outline" class="title-field">
                <mat-label>Title</mat-label>
                <input matInput [(ngModel)]="noteForm().title" placeholder="Note title" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="category-field">
                <mat-label>Category</mat-label>
                <mat-select [(ngModel)]="noteForm().category">
                  <mat-option value="general">General</mat-option>
                  <mat-option value="learning">Learning</mat-option>
                  <mat-option value="task">Task Notes</mat-option>
                  <mat-option value="idea">Ideas</mat-option>
                  <mat-option value="meeting">Meeting Notes</mat-option>
                  <mat-option value="documentation">Documentation</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="content-field">
                <mat-label>Content</mat-label>
                <textarea matInput [(ngModel)]="noteForm().content" rows="12" placeholder="Write your note here..."></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="tags-field">
                <mat-label>Tags (comma-separated)</mat-label>
                <input matInput [(ngModel)]="noteForm().tags" placeholder="tag1, tag2, tag3" />
              </mat-form-field>

              <div class="editor-options">
                <mat-checkbox [(ngModel)]="noteForm().is_pinned">
                  <mat-icon>push_pin</mat-icon>
                  Pin this note
                </mat-checkbox>
              </div>
            </mat-card-content>

            <mat-card-actions class="editor-actions" align="end">
              <button mat-button (click)="closeEditor()">Cancel</button>
              <button mat-button color="primary" (click)="saveNote()">
                <mat-icon>save</mat-icon>
                Save Note
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .notes-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .notes-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .notes-title {
      font-size: 32px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 8px 0;
    }

    .notes-subtitle {
      font-size: 16px;
      color: #64748B;
      margin: 0;
    }

    .search-section {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
      flex-wrap: wrap;
      align-items: center;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    .filter-field {
      width: 200px;
    }

    .search-section button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .search-section button.active {
      background-color: #2563EB;
      color: white;
    }

    .search-section button .active-icon {
      color: #F59E0B;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      gap: 16px;
      color: #94A3B8;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .note-card {
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .note-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .note-card.pinned {
      border-color: #F59E0B;
      border-width: 2px;
    }

    .note-header {
      position: relative;
    }

    .note-icon {
      color: #2563EB;
    }

    .note-header-text {
      flex: 1;
    }

    .note-title {
      font-size: 16px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 4px 0;
    }

    .note-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
    }

    .note-category {
      color: #64748B;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .note-date {
      color: #94A3B8;
    }

    .more-button {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .note-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .note-preview {
      color: #475569;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .note-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .note-tags mat-chip {
      cursor: pointer;
    }

    .note-link {
      display: flex;
      gap: 8px;
    }

    .note-actions {
      padding: 8px 16px 16px;
      display: flex;
      gap: 8px;
    }

    .note-actions button {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Editor Overlay */
    .editor-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
    }

    .editor-card {
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 12px;
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .editor-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .title-field,
    .category-field {
      width: 100%;
    }

    .content-field {
      width: 100%;
    }

    .content-field textarea {
      font-family: inherit;
      line-height: 1.6;
    }

    .tags-field {
      width: 100%;
    }

    .editor-options {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .editor-actions {
      padding: 16px 24px;
      display: flex;
      gap: 12px;
    }

    .editor-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Dark mode */
    :host-context(.dark) {
      .notes-title { color: #F8FAFC; }
      .note-card {
        background-color: #1E293B;
        border-color: #334155;
      }
      .note-title { color: #F8FAFC; }
      .note-preview { color: #94A3B8; }
      .editor-card {
        background-color: #1E293B;
        color: #F8FAFC;
      }
    }
  `]
})
export class NotesComponent {
  private notesRepo = inject(NotesRepository);
  private profileService = inject(ProfileService);

  allNotes = signal<Note[]>([]);
  filteredNotes = signal<Note[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);

  searchQuery = signal('');
  selectedCategory = signal<string | null>(null);
  pinnedOnly = signal(false);

  showEditor = signal(false);
  editingNote = signal<Note | null>(null);

  noteForm = signal<{
    title: string;
    content: string;
    category: string;
    tags: string;
    is_pinned: boolean;
  }>({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    is_pinned: false
  });

  async ngOnInit() {
    await this.loadNotes();
  }

  private async loadNotes() {
    const user = this.profileService.currentUser();
    if (!user) return;

    this.allNotes.set(await this.notesRepo.getAllNotes(user.id));
    this.categories.set(await this.notesRepo.getAllCategories(user.id));
    this.filteredNotes.set(this.allNotes());
    this.loading.set(false);
  }

  filterNotes() {
    const filters: NoteFilters = {};

    if (this.searchQuery()) {
      filters.search = this.searchQuery();
    }

    if (this.selectedCategory()) {
      filters.category = this.selectedCategory();
    }

    if (this.pinnedOnly()) {
      filters.is_pinned = true;
    }

    const user = this.profileService.currentUser();
    if (user) {
      this.notesRepo.getAllNotes(user.id, filters).then(notes => {
        this.filteredNotes.set(notes);
      });
    }
  }

  filterByTag(tag: string) {
    this.searchQuery.set(tag);
    this.filterNotes();
  }

  togglePinnedOnly() {
    this.pinnedOnly.update(v => !v);
    this.filterNotes();
  }

  openNewNote() {
    this.editingNote.set(null);
    this.noteForm.set({
      title: '',
      content: '',
      category: 'general',
      tags: '',
      is_pinned: false
    });
    this.showEditor.set(true);
  }

  editNote(id: string) {
    const note = this.allNotes().find(n => n.id === id);
    if (note) {
      this.editingNote.set(note);
      this.noteForm.set({
        title: note.title,
        content: note.content || '',
        category: note.category,
        tags: note.tags || '',
        is_pinned: note.is_pinned
      });
      this.showEditor.set(true);
    }
  }

  viewNote(id: string) {
    // TODO: Implement note detail view
    console.log('View note:', id);
  }

  async saveNote() {
    const user = this.profileService.currentUser();
    if (!user || !this.noteForm().title) return;

    const form = this.noteForm();
    const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(t => t) : [];

    if (this.editingNote()) {
      await this.notesRepo.updateNote(this.editingNote()!.id, {
        title: form.title,
        content: form.content,
        category: form.category,
        tags,
        is_pinned: form.is_pinned
      });
    } else {
      await this.notesRepo.createNote({
        user_id: user.id,
        title: form.title,
        content: form.content,
        category: form.category,
        tags,
        is_pinned: form.is_pinned
      });
    }

    this.closeEditor();
    await this.loadNotes();
  }

  async duplicateNote(id: string) {
    const note = this.allNotes().find(n => n.id === id);
    if (note) {
      const user = this.profileService.currentUser();
      if (user) {
        const tags = note.tags ? note.tags.split(',') : [];
        await this.notesRepo.createNote({
          user_id: user.id,
          title: `${note.title} (Copy)`,
          content: note.content,
          category: note.category,
          tags,
          is_pinned: false
        });
        await this.loadNotes();
      }
    }
  }

  async togglePin(id: string) {
    await this.notesRepo.togglePin(id);
    await this.loadNotes();
  }

  async deleteNote(id: string) {
    if (confirm('Delete this note? This action cannot be undone.')) {
      await this.notesRepo.deleteNote(id);
      await this.loadNotes();
    }
  }

  closeEditor() {
    this.showEditor.set(false);
    this.editingNote.set(null);
  }

  getPreview(content: string | null): string {
    if (!content) return 'No content';
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  }

  getTags(tagsStr: string | null): string[] {
    if (!tagsStr) return [];
    return tagsStr.split(',').map(t => t.trim()).filter(t => t);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
