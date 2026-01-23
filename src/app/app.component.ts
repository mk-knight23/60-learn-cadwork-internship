import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
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
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="min-h-screen flex bg-cad-bg dark:bg-cad-dark transition-colors duration-500">
      
      <!-- Sidebar -->
      <aside class="w-72 bg-slate-900 border-r border-white/5 p-8 flex flex-col justify-between h-screen sticky top-0 hidden lg:flex">
         <div class="space-y-12">
            <div class="flex items-center space-x-3 px-2">
               <div class="w-10 h-10 bg-cad-blue rounded-xl flex items-center justify-center font-mono font-black italic text-xl text-white">CW</div>
               <div class="flex flex-col">
                  <span class="text-white font-black tracking-tighter text-lg leading-none uppercase">Cadwork</span>
                  <span class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Internship Portal</span>
               </div>
            </div>

            <nav class="space-y-2">
               <div class="cad-sidebar-item cad-sidebar-item-active">
                  <lucide-icon [name]="'layout-dashboard'" [size]="18"></lucide-icon>
                  <span class="text-sm font-bold">Dashboard</span>
               </div>
               <div class="cad-sidebar-item">
                  <lucide-icon [name]="'folder-kanban'" [size]="18"></lucide-icon>
                  <span class="text-sm font-bold">Projects</span>
               </div>
               <div class="cad-sidebar-item">
                  <lucide-icon [name]="'bar-chart-3'" [size]="18"></lucide-icon>
                  <span class="text-sm font-bold">Analytics</span>
               </div>
               <div class="cad-sidebar-item">
                  <lucide-icon [name]="'file-text'" [size]="18"></lucide-icon>
                  <span class="text-sm font-bold">Documentation</span>
               </div>
            </nav>
         </div>

         <div class="space-y-4">
            <div class="cad-sidebar-item">
               <lucide-icon [name]="'settings'" [size]="18"></lucide-icon>
               <span class="text-sm font-bold">Settings</span>
            </div>
            <div class="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-3">
               <p class="text-[10px] font-black uppercase text-slate-500 tracking-widest">Storage Status</p>
               <div class="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-cad-blue w-2/3"></div>
               </div>
               <p class="text-[10px] text-white font-bold">65% of 2GB used</p>
            </div>
         </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 min-w-0 flex flex-col h-screen">
         
         <!-- Header -->
         <header class="h-20 border-b border-slate-200 dark:border-slate-800 px-10 flex items-center justify-between sticky top-0 bg-cad-bg/80 dark:bg-cad-dark/80 backdrop-blur-md z-40">
            <div class="flex items-center space-x-6 flex-1">
               <h2 class="text-xl font-display font-black tracking-tight dark:text-white">Workspace Overview</h2>
               <div class="relative w-full max-w-xs group hidden sm:block">
                  <lucide-icon [name]="'search'" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cad-blue" [size]="14"></lucide-icon>
                  <input type="text" placeholder="Search resources..." class="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-cad-blue transition-all">
               </div>
            </div>

            <div class="flex items-center space-x-6">
               <div class="flex items-center space-x-4 border-r border-slate-200 dark:border-slate-800 pr-6">
                  <button class="relative p-2 text-slate-400 hover:text-cad-blue transition-colors">
                     <lucide-icon [name]="'bell'" [size]="20"></lucide-icon>
                     <span class="absolute top-2 right-2 w-2 h-2 bg-cad-orange rounded-full border-2 border-cad-bg dark:border-cad-dark"></span>
                  </button>
               </div>
               <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-cad-blue to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">MK</div>
                  <div class="flex flex-col hidden sm:flex">
                     <span class="text-xs font-black uppercase dark:text-white leading-none">M. Kazi</span>
                     <span class="text-[10px] font-bold text-slate-400">Project Architect</span>
                  </div>
               </div>
            </div>
         </header>

         <!-- View Content -->
         <div class="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
            
            <!-- Stats Grid -->
            <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
               <div v-for="stat in stats" class="glass-card p-8 space-y-6">
                  <div class="flex justify-between items-start">
                     <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-cad-blue">
                        <lucide-icon [name]="'folder-kanban'" [size]="24"></lucide-icon>
                     </div>
                     <lucide-icon [name]="'more-vertical'" class="text-slate-300" [size]="16"></lucide-icon>
                  </div>
                  <div class="space-y-1">
                     <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Projects</p>
                     <p class="text-3xl font-display font-black dark:text-white">12</p>
                  </div>
               </div>
               <div class="glass-card p-8 space-y-6">
                  <div class="flex justify-between items-start">
                     <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-500">
                        <lucide-icon [name]="'check-circle-2'" [size]="24"></lucide-icon>
                     </div>
                     <lucide-icon [name]="'more-vertical'" class="text-slate-300" [size]="16"></lucide-icon>
                  </div>
                  <div class="space-y-1">
                     <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Completed Tasks</p>
                     <p class="text-3xl font-display font-black dark:text-white">148</p>
                  </div>
               </div>
               <div class="glass-card p-8 space-y-6">
                  <div class="flex justify-between items-start">
                     <div class="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-cad-orange">
                        <lucide-icon [name]="'clock'" [size]="24"></lucide-icon>
                     </div>
                     <lucide-icon [name]="'more-vertical'" class="text-slate-300" [size]="16"></lucide-icon>
                  </div>
                  <div class="space-y-1">
                     <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Hours Logged</p>
                     <p class="text-3xl font-display font-black dark:text-white">640</p>
                  </div>
               </div>
               <div class="glass-card p-8 space-y-6">
                  <div class="flex justify-between items-start">
                     <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500">
                        <lucide-icon [name]="'bar-chart-3'" [size]="24"></lucide-icon>
                     </div>
                     <lucide-icon [name]="'more-vertical'" class="text-slate-300" [size]="16"></lucide-icon>
                  </div>
                  <div class="space-y-1">
                     <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Team Efficiency</p>
                     <p class="text-3xl font-display font-black dark:text-white">92%</p>
                  </div>
               </div>
            </section>

            <!-- Active Projects Table-ish List -->
            <section class="space-y-8">
               <div class="flex items-end justify-between">
                  <div class="space-y-2">
                     <h3 class="text-2xl font-display font-black tracking-tight dark:text-white">Operational Projects</h3>
                     <p class="text-sm text-slate-500 font-medium">Tracking high-impact internship deliverables for Q1-Q2.</p>
                  </div>
                  <button class="bg-cad-blue hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg shadow-cad-blue/20 transition-all active:scale-95">
                     <lucide-icon [name]="'plus'" [size]="14"></lucide-icon>
                     <span>Initiate New</span>
                  </button>
               </div>

               <div class="grid gap-6">
                  @for (project of projects; track project.id) {
                     <div class="glass-card p-8 group hover:border-cad-blue transition-all cursor-default">
                        <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                           <div class="flex items-center space-x-6 min-w-0">
                              <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-mono font-black text-slate-400">
                                 #{{ project.id }}
                              </div>
                              <div class="space-y-1 min-w-0">
                                 <h4 class="text-xl font-bold dark:text-white truncate">{{ project.title }}</h4>
                                 <div class="flex items-center space-x-4 text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                                    <span class="flex items-center gap-1"><lucide-icon [name]="'clock'" [size]="10"></lucide-icon> {{ project.startDate }}</span>
                                    <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span class="text-cad-blue">{{ project.status }}</span>
                                 </div>
                              </div>
                           </div>

                           <div class="flex-1 max-w-md">
                              <div class="flex justify-between mb-2">
                                 <span class="text-[10px] font-black uppercase text-slate-400">Execution Progress</span>
                                 <span class="text-[10px] font-black text-cad-blue">{{ project.progress }}%</span>
                              </div>
                              <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                 <div class="h-full bg-cad-blue transition-all duration-1000" [style.width.%]="project.progress"></div>
                              </div>
                           </div>

                           <div class="flex items-center space-x-4">
                              <div class="flex -space-x-3">
                                 <div class="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center text-[10px] font-black">JD</div>
                                 <div class="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-300 flex items-center justify-center text-[10px] font-black">AS</div>
                              </div>
                              <button class="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                                 <lucide-icon [name]="'chevron-right'" [size]="20"></lucide-icon>
                              </button>
                           </div>
                        </div>
                     </div>
                  }
               </div>
            </section>

         </div>
         
         <!-- Global Footer -->
         <footer class="h-16 border-t border-slate-200 dark:border-slate-800 px-10 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span>© 2026 Cadwork Engineering</span>
            <div class="flex items-center space-x-8">
               <a href="#" class="hover:text-cad-blue transition-colors">Documentation</a>
               <a href="#" class="hover:text-cad-blue transition-colors">Privacy Architecture</a>
            </div>
         </footer>
      </main>

    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class App {
  projects = [
    { id: 'PRJ-001', title: 'Hydraulic System Blueprinting', status: 'ongoing', progress: 65, startDate: 'Jan 15, 2026' },
    { id: 'PRJ-002', title: 'Automated CAD Validation Engine', status: 'review', progress: 92, startDate: 'Feb 02, 2026' },
    { id: 'PRJ-003', title: 'Turbine Optimization Report', status: 'completed', progress: 100, startDate: 'Dec 10, 2025' },
    { id: 'PRJ-004', title: 'Material Stress Simulation', status: 'draft', progress: 12, startDate: 'Feb 10, 2026' }
  ];
}
