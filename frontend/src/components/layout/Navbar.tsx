import React from 'react';
import { Search, Bell } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-30">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <Input 
            className="pl-10 h-10 bg-slate-50 border-none group-focus-within:bg-white group-focus-within:ring-2 group-focus-within:ring-primary-500/10" 
            placeholder="Search tasks..." 
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="relative group">
          <Bell className="h-5 w-5 text-slate-500 group-hover:text-primary-600 transition-colors" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <Button variant="ghost" size="sm" className="p-0 h-9 w-9 rounded-full overflow-hidden border border-slate-200">
           <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Profile" 
            className="h-full w-full object-cover"
          />
        </Button>
      </div>
    </header>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
