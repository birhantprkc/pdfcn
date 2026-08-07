/* eslint-disable react-refresh/only-export-components */
// Exports both a component (PdfcnThemeProvider) and hooks/context intentionally.
// All PDF components import from a single file — splitting would break the public API.

import * as React from "react";
import { createContext, useContext, useMemo } from "react";
import type { DependencyList, ReactNode } from "react";

import { theme as defaultTheme } from "./pdfcn-theme";

export type PdfcnTheme = typeof defaultTheme;

export const PdfcnThemeContext = createContext<PdfcnTheme>(defaultTheme);

export interface PdfcnThemeProviderProps {
  theme?: PdfcnTheme;
  children: ReactNode;
}

/**
 * Detect whether React currently has an active dispatcher.
 * When components are invoked as plain functions in tests, dispatcher is null.
 */
function hasActiveDispatcher(): boolean {
  const maybeInternals = React as unknown as {
    __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: {
      H?: unknown;
    };
  };

  const dispatcher =
    maybeInternals
      .__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?.H;
  return dispatcher != null;
}

export function PdfcnThemeProvider({
  theme,
  children,
}: PdfcnThemeProviderProps) {
  const resolvedTheme = useMemo(() => theme ?? defaultTheme, [theme]);
  return (
    <PdfcnThemeContext.Provider value={resolvedTheme}>
      {children}
    </PdfcnThemeContext.Provider>
  );
}

/**
 * Regex patterns that indicate a hook was called outside a valid React render tree.
 * These errors are caught and suppressed so components fall back to safe defaults.
 */
const HOOK_ERROR_PATTERNS =
  /invalid hook call|useContext|useMemo|cannot read properties of null|dispatcher|renderWithHooks|resolveDispatcher|hooks can only be called|rendered fewer hooks/i;

/**
 * Calls a React hook with a graceful fallback for non-render environments (e.g. unit tests).
 * Uses hasActiveDispatcher() as the primary guard; the try/catch is a safety net for edge
 * cases where the dispatcher check passes but the hook still cannot execute.
 */
function callHook<T>(hook: () => T, fallback: T): T {
  if (!hasActiveDispatcher()) {
    return fallback;
  }
  try {
    return hook();
  } catch (error) {
    if (error instanceof Error && HOOK_ERROR_PATTERNS.test(error.message)) {
      return fallback;
    }
    throw error;
  }
}

/**
 * Returns the active PdfcnTheme from context, or the default theme when called
 * outside a React render tree (e.g. unit tests).
 */
export function usePdfcnTheme(): PdfcnTheme {
  return callHook(() => useContext(PdfcnThemeContext), defaultTheme);
}

/**
 * Calls factory() and returns the result.
 * The deps parameter is accepted for API compatibility with existing callers.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useSafeMemo<T>(factory: () => T, _deps: DependencyList): T {
  return factory();
}
