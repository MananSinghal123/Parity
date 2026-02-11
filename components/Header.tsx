"use client";

import { Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-text-secondary">All Systems Operational</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 hover:bg-surface-light transition-colors">
          <Bell className="h-5 w-5 text-text-secondary" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger" />
        </button>
        
        <button className="flex items-center gap-2 rounded-lg bg-surface-light px-3 py-2 hover:bg-border transition-colors">
          <User className="h-5 w-5 text-text-secondary" />
          <span className="text-sm text-text-primary">0x742d...5e89</span>
        </button>
      </div>
    </header>
  );
}
