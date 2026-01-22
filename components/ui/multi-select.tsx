"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";

export interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  className,
  id,
  disabled,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (option: string) => {
    if (disabled || !onChange) return;
    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    if (typeof onChange === "function") {
      onChange(newValue);
    }
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    if (disabled || !onChange) return;
    e.stopPropagation();
    if (typeof onChange === "function") {
      onChange(value.filter((v) => v !== option));
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            value.map((option) => (
              <span
                key={option}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs"
              >
                {option}
                <button
                  type="button"
                  onClick={(e) => removeOption(option, e)}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "transform rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-1">
            {options.map((option) => {
              const isSelected = value.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    "flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent",
                    isSelected && "bg-accent"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOption(option)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>{option}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

