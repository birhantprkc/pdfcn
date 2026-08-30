"use client";

import { useEffect, useMemo, useReducer } from "react";

import type { PdfcnTheme, ThemePresetName } from "@/registry/themes";
import { themePresets } from "@/registry/themes";

import { readThemeState } from "./theme-storage";
import type { StoredThemeState } from "./theme-storage";

const HISTORY_LIMIT = 30;

export type ColorTokenName = keyof PdfcnTheme["colors"];
export type HeadingLevel =
  keyof PdfcnTheme["typography"]["heading"]["fontSize"];
export type PageMargin = keyof PdfcnTheme["spacing"]["page"];
export type SpacingTokenName = Exclude<keyof PdfcnTheme["spacing"], "page">;

type ThemeUpdate = (theme: PdfcnTheme) => PdfcnTheme;
type ThemeSnapshot = StoredThemeState;

interface ThemeBuilderState {
  basePreset: ThemePresetName;
  future: ThemeSnapshot[];
  hydrated: boolean;
  past: ThemeSnapshot[];
  theme: PdfcnTheme;
}

type ThemeBuilderAction =
  | { type: "HYDRATE"; stored: StoredThemeState | null }
  | { type: "UPDATE"; update: ThemeUpdate }
  | { type: "LOAD_PRESET"; preset: ThemePresetName }
  | { type: "UNDO" }
  | { type: "REDO" };

const cloneTheme = (theme: PdfcnTheme): PdfcnTheme => ({
  ...theme,
  colors: { ...theme.colors },
  page: { ...theme.page },
  primitives: {
    ...theme.primitives,
    borderRadius: { ...theme.primitives.borderRadius },
    fontWeights: { ...theme.primitives.fontWeights },
    letterSpacing: { ...theme.primitives.letterSpacing },
    lineHeights: { ...theme.primitives.lineHeights },
    spacing: { ...theme.primitives.spacing },
    typography: { ...theme.primitives.typography },
  },
  spacing: {
    ...theme.spacing,
    page: { ...theme.spacing.page },
  },
  typography: {
    body: { ...theme.typography.body },
    heading: {
      ...theme.typography.heading,
      fontSize: { ...theme.typography.heading.fontSize },
    },
  },
});

const pushHistory = (
  history: ThemeSnapshot[],
  snapshot: ThemeSnapshot
): ThemeSnapshot[] => [...history.slice(-(HISTORY_LIMIT - 1)), snapshot];

const snapshotState = (state: ThemeBuilderState): ThemeSnapshot => ({
  basePreset: state.basePreset,
  theme: state.theme,
});

const reducer = (
  state: ThemeBuilderState,
  action: ThemeBuilderAction
): ThemeBuilderState => {
  if (action.type === "HYDRATE") {
    if (state.hydrated) {
      return state;
    }

    return action.stored
      ? {
          basePreset: action.stored.basePreset,
          future: [],
          hydrated: true,
          past: [],
          theme: cloneTheme(action.stored.theme),
        }
      : { ...state, hydrated: true };
  }

  if (action.type === "UPDATE") {
    const nextTheme = action.update(state.theme);
    if (nextTheme === state.theme) {
      return state;
    }

    return {
      ...state,
      future: [],
      past: pushHistory(state.past, snapshotState(state)),
      theme: nextTheme,
    };
  }

  if (action.type === "LOAD_PRESET") {
    return {
      ...state,
      basePreset: action.preset,
      future: [],
      past: pushHistory(state.past, snapshotState(state)),
      theme: cloneTheme(themePresets[action.preset]),
    };
  }

  if (action.type === "UNDO") {
    const previous = state.past.at(-1);
    if (!previous) {
      return state;
    }

    return {
      ...state,
      basePreset: previous.basePreset,
      future: [
        snapshotState(state),
        ...state.future.slice(0, HISTORY_LIMIT - 1),
      ],
      past: state.past.slice(0, -1),
      theme: previous.theme,
    };
  }

  if (action.type === "REDO") {
    const [next, ...remaining] = state.future;
    if (!next) {
      return state;
    }

    return {
      ...state,
      basePreset: next.basePreset,
      future: remaining,
      past: pushHistory(state.past, snapshotState(state)),
      theme: next.theme,
    };
  }

  return state;
};

export interface ThemeBuilderActions {
  loadPreset: (preset: ThemePresetName) => void;
  redo: () => void;
  setBodyFontFamily: (value: string) => void;
  setBodyFontSize: (value: number) => void;
  setBodyLineHeight: (value: number) => void;
  setColor: (key: ColorTokenName, value: string) => void;
  setHeadingFontFamily: (value: string) => void;
  setHeadingFontSize: (level: HeadingLevel, value: number) => void;
  setHeadingFontWeight: (value: number) => void;
  setHeadingLineHeight: (value: number) => void;
  setName: (value: string) => void;
  setPageMargin: (edge: PageMargin, value: number) => void;
  setPageOrientation: (value: PdfcnTheme["page"]["orientation"]) => void;
  setPageSize: (value: PdfcnTheme["page"]["size"]) => void;
  setSpacing: (key: SpacingTokenName, value: number) => void;
  undo: () => void;
}

export const useThemeBuilder = () => {
  const [state, dispatch] = useReducer(reducer, {
    basePreset: "professional",
    future: [],
    hydrated: false,
    past: [],
    theme: cloneTheme(themePresets.professional),
  });

  useEffect(() => {
    dispatch({ stored: readThemeState(), type: "HYDRATE" });
  }, []);

  const actions = useMemo<ThemeBuilderActions>(
    () => ({
      loadPreset: (preset) => dispatch({ preset, type: "LOAD_PRESET" }),
      redo: () => dispatch({ type: "REDO" }),
      setBodyFontFamily: (value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.typography.body.fontFamily === value
              ? theme
              : {
                  ...theme,
                  typography: {
                    ...theme.typography,
                    body: { ...theme.typography.body, fontFamily: value },
                  },
                },
        }),
      setBodyFontSize: (value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.typography.body.fontSize === value
              ? theme
              : {
                  ...theme,
                  typography: {
                    ...theme.typography,
                    body: { ...theme.typography.body, fontSize: value },
                  },
                },
        }),
      setBodyLineHeight: (value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.typography.body.lineHeight === value
              ? theme
              : {
                  ...theme,
                  typography: {
                    ...theme.typography,
                    body: { ...theme.typography.body, lineHeight: value },
                  },
                },
        }),
      setColor: (key, value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.colors[key] === value
              ? theme
              : { ...theme, colors: { ...theme.colors, [key]: value } },
        }),
      setHeadingFontFamily: (value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.typography.heading.fontFamily === value
              ? theme
              : {
                  ...theme,
                  typography: {
                    ...theme.typography,
                    heading: {
                      ...theme.typography.heading,
                      fontFamily: value,
                    },
                  },
                },
        }),
      setHeadingFontSize: (level, value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.typography.heading.fontSize[level] === value
              ? theme
              : {
                  ...theme,
                  typography: {
                    ...theme.typography,
                    heading: {
                      ...theme.typography.heading,
                      fontSize: {
                        ...theme.typography.heading.fontSize,
                        [level]: value,
                      },
                    },
                  },
                },
        }),
      setHeadingFontWeight: (value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.typography.heading.fontWeight === value
              ? theme
              : {
                  ...theme,
                  typography: {
                    ...theme.typography,
                    heading: {
                      ...theme.typography.heading,
                      fontWeight: value,
                    },
                  },
                },
        }),
      setHeadingLineHeight: (value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.typography.heading.lineHeight === value
              ? theme
              : {
                  ...theme,
                  typography: {
                    ...theme.typography,
                    heading: {
                      ...theme.typography.heading,
                      lineHeight: value,
                    },
                  },
                },
        }),
      setName: (value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.name === value ? theme : { ...theme, name: value },
        }),
      setPageMargin: (edge, value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.spacing.page[edge] === value
              ? theme
              : {
                  ...theme,
                  spacing: {
                    ...theme.spacing,
                    page: { ...theme.spacing.page, [edge]: value },
                  },
                },
        }),
      setPageOrientation: (value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.page.orientation === value
              ? theme
              : { ...theme, page: { ...theme.page, orientation: value } },
        }),
      setPageSize: (value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.page.size === value
              ? theme
              : { ...theme, page: { ...theme.page, size: value } },
        }),
      setSpacing: (key, value) =>
        dispatch({
          type: "UPDATE",
          update: (theme) =>
            theme.spacing[key] === value
              ? theme
              : { ...theme, spacing: { ...theme.spacing, [key]: value } },
        }),
      undo: () => dispatch({ type: "UNDO" }),
    }),
    []
  );

  return {
    actions,
    basePreset: state.basePreset,
    canRedo: state.future.length > 0,
    canUndo: state.past.length > 0,
    hydrated: state.hydrated,
    theme: state.theme,
  };
};
