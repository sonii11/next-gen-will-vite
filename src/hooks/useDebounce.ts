import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for debouncing a value
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes before the delay has passed
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for handling debounced input with sanitization
 * @param initialValue The initial value
 * @param onChange The callback function to run when the value changes
 * @param delay The delay in milliseconds
 * @param sanitize Optional function to sanitize the input
 * @returns An object with the current value, a setter function, and the debounced value
 */
export function useDebouncedInput<T>(
  initialValue: T,
  onChange: (value: T) => void,
  delay: number = 500,
  sanitize?: (value: T) => T
): {
  value: T;
  setValue: (value: T) => void;
  debouncedValue: T;
} {
  const [value, setValueState] = useState<T>(initialValue);
  const isFirstRender = useRef(true);

  // Apply sanitization if provided
  const setValue = useCallback(
    (newValue: T) => {
      const sanitizedValue = sanitize ? sanitize(newValue) : newValue;
      setValueState(sanitizedValue);
    },
    [sanitize]
  );

  const debouncedValue = useDebounce<T>(value, delay);

  useEffect(() => {
    // Skip the effect on first render to avoid calling onChange with the initial value
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Call the onChange callback with the debounced value
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return { value, setValue, debouncedValue };
}

/**
 * Sanitizes a string by removing potentially dangerous characters
 * @param input The input string
 * @returns The sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input) return input;

  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, "");

  // Remove script, iframe, and other potentially dangerous tags
  sanitized = sanitized.replace(
    /(javascript|script|iframe|eval|vbscript|expression|alert|onclick|onload|onerror)/gi,
    ""
  );

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitizes an object by applying sanitizeString to all string properties
 * @param obj The input object
 * @returns The sanitized object
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  if (!obj) return obj;

  const result = { ...obj } as T;

  Object.entries(result).forEach(([key, value]) => {
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null) {
      (result as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>
      );
    }
  });

  return result;
}
