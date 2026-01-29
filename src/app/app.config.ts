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
  Github
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
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
      Github
    }))
  ]
};
