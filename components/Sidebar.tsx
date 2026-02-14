"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [{ name: "Markets", href: "/markets", icon: TrendingUp }];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-surface border-r border-border">
      <Link
        href="/"
        className="flex h-16 items-center gap-2 px-6 border-b border-border"
      >
        <Image
          src="/parity-logo.jpg"
          alt="Parity"
          width={40}
          height={40}
          className="rounded"
        />
        <span className="text-xl font-bold text-text-primary">Parity</span>
      </Link>

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
                  : "text-text-secondary hover:bg-surface-light hover:text-text-primary",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
