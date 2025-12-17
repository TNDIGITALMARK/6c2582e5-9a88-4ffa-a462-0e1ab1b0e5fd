'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

export function AtFinderLogo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
      aria-label="AtFinder Logo"
    >
      {/* Magnifying Glass Circle (Outer) */}
      <circle
        cx="40"
        cy="40"
        r="28"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
      />

      {/* @ Symbol Inside */}
      <path
        d="M 40 25 C 31.72 25 25 31.72 25 40 C 25 48.28 31.72 55 40 55 C 43.31 55 46.36 53.87 48.75 52 L 48.75 48 C 48.75 45.24 46.51 43 43.75 43 L 40 43 C 35.86 43 32.5 39.64 32.5 35.5 C 32.5 31.36 35.86 28 40 28 C 44.14 28 47.5 31.36 47.5 35.5 L 47.5 40 C 47.5 44.14 44.14 47.5 40 47.5"
        stroke="currentColor"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Small circle in @ center */}
      <circle
        cx="40"
        cy="35.5"
        r="3.5"
        fill="currentColor"
      />

      {/* Magnifying Glass Handle */}
      <line
        x1="60"
        y1="60"
        x2="85"
        y2="85"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
