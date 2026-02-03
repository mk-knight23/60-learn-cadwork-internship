import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  LucideAngularModule,
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  FileText,
  Settings,
  Search,
  Bell,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Plus,
  Github,
  User,
  LogOut,
  Moon,
  Sun,
  Timer,
  StickyNote,
  Activity
} from 'lucide-angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { databaseInitializer } from './core/initializers/database-init';
import { DatabaseService } from './core/services/database.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    DatabaseService,
    {
      provide: 'APP_INITIALIZER',
      useFactory: databaseInitializer,
      multi: true,
      deps: [DatabaseService]
    },
    importProvidersFrom(LucideAngularModule.pick({
      LayoutDashboard,
      FolderKanban,
      BarChart3,
      FileText,
      Settings,
      Search,
      Bell,
      ChevronRight,
      Clock,
      CheckCircle2,
      AlertCircle,
      MoreVertical,
      Plus,
      Github,
      User,
      LogOut,
      Moon,
      Sun,
      Timer,
      StickyNote,
      Activity
    }))
  ]
};
