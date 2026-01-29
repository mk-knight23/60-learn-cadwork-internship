import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="not-found-container">
      <mat-card class="not-found-card">
        <div class="error-icon">
          <mat-icon>search_off</mat-icon>
        </div>
        
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-message">
          The page you're looking for doesn't exist or has been moved.
          Check the URL or navigate back to the dashboard.
        </p>

        <div class="error-actions">
          <a mat-raised-button color="primary" routerLink="/dashboard">
            <mat-icon>dashboard</mat-icon>
            Go to Dashboard
          </a>
          <a mat-stroked-button routerLink="/lessons">
            <mat-icon>school</mat-icon>
            Browse Lessons
          </a>
        </div>
      </mat-card>

      <div class="suggestions">
        <h3>You might be looking for:</h3>
        <div class="suggestion-links">
          <a routerLink="/projects">
            <mat-icon>folder</mat-icon>
            Projects
          </a>
          <a routerLink="/lessons">
            <mat-icon>school</mat-icon>
            Lessons
          </a>
          <a routerLink="/skills">
            <mat-icon>psychology</mat-icon>
            Skills
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
    }

    .not-found-card {
      text-align: center;
      padding: 64px 48px;
      border-radius: 24px;
      max-width: 500px;
      width: 100%;
    }

    .error-icon {
      width: 96px;
      height: 96px;
      background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 32px;
    }

    .error-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #EF4444;
    }

    .error-code {
      font-size: 80px;
      font-weight: 800;
      color: #1E293B;
      margin: 0;
      line-height: 1;
      background: linear-gradient(135deg, #1E293B 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .error-title {
      font-size: 28px;
      font-weight: 700;
      color: #1E293B;
      margin: 16px 0 12px 0;
    }

    .error-message {
      font-size: 16px;
      color: #64748B;
      line-height: 1.6;
      margin: 0 0 32px 0;
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .error-actions a {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .suggestions {
      margin-top: 48px;
      text-align: center;
    }

    .suggestions h3 {
      font-size: 14px;
      font-weight: 600;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 16px 0;
    }

    .suggestion-links {
      display: flex;
      gap: 24px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .suggestion-links a {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #2563EB;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .suggestion-links a:hover {
      color: #1D4ED8;
    }

    .suggestion-links mat-icon {
      font-size: 20px;
    }

    :host-context(.dark) {
      .not-found-container {
        background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      }
      .not-found-card { background-color: #1E293B; }
      .error-code { 
        background: linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .error-title { color: #F8FAFC; }
    }
  `]
})
export class NotFoundComponent {}
