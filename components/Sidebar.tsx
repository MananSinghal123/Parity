"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Briefcase, Shield, Settings, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Markets", href: "/markets", icon: TrendingUp },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "Risk Dashboard", href: "/risk-dashboard", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-surface border-r border-border">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <BarChart3 className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-text-primary">Parity</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-surface-light text-primary"
                  : "text-text-secondary hover:bg-surface-light hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-surface-light p-3">
          <p className="text-xs text-text-tertiary mb-1">Total Portfolio Value</p>
          <p className="text-lg font-semibold text-text-primary">$6,322.00</p>
          <p className="text-xs text-success">+$12.50 (+0.20%)</p>
        </div>
      </div>
    </div>
  );
}
