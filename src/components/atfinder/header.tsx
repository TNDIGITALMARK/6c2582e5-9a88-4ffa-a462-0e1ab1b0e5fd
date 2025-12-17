'use client';

import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AtFinderHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[60px]">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold text-foreground">
              AtFinder
            </div>
          </Link>

          {/* Center: Page Title */}
          <div className="hidden md:block text-base font-medium text-foreground">
            @ Discovery
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button
              className="tap-target flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {/* Ask CTA Button */}
            <Link href="/ask">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-4 py-2 h-10 rounded-full"
              >
                Ask for an @
              </Button>
            </Link>

            {/* Login/Profile */}
            <button
              className="tap-target flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Show page title below header on small screens */}
      <div className="md:hidden border-t border-border bg-background">
        <div className="container mx-auto px-4 py-2">
          <div className="text-sm font-medium text-foreground text-center">
            @ Discovery
          </div>
        </div>
      </div>
    </header>
  );
}
