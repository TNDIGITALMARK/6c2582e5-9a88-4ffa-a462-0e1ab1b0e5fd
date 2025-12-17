'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  isActive?: boolean;
}

export function FilterDropdown({ label, value, options, onChange, isActive }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const currentOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Label */}
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </label>

      {/* Dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
          transition-all duration-200
          ${isActive
            ? 'bg-primary/10 border border-primary/30 text-primary'
            : 'bg-secondary border border-border text-foreground hover:bg-accent'
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">{currentOption?.label || 'Select'}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-3 py-2.5 text-left text-sm font-medium transition-colors
                ${option.value === value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
                }
              `}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
