import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract variables from prompt content
 * Variables are in the format {{variableName}}
 */
export function extractVariables(content: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = [...content.matchAll(regex)];
  return [...new Set(matches.map((m) => m[1]?.trim()).filter((v): v is string => v !== undefined))];
}

/**
 * Fill variables in prompt content
 */
export function fillVariables(content: string, values: Record<string, string>): string {
  return content.replace(/\{\{([^}]+)\}\}/g, (_, name) => {
    const trimmedName = name.trim();
    return values[trimmedName] ?? `{{${trimmedName}}}`;
  });
}
