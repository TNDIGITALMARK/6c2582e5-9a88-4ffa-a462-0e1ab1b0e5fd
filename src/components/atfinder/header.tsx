'use client';

import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function AtFinderHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo + Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            aria-label="AtFinder Home"
          >
            <Image
              src="/atfinder-logo.png"
              alt="AtFinder logo"
              width={32}
              height={32}
              className="flex-shrink-0"
              priority
            />
            <span className="text-lg font-semibold text-foreground">
              AtFinder
            </span>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {/* Ask CTA Button */}
            <Link href="/ask">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-3 py-1.5 h-9 rounded-full text-sm"
              >
                Ask for @
              </Button>
            </Link>

            {/* Login/Profile */}
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
