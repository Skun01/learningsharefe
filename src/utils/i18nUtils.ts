/**
 * Utility functions for internationalization and language handling.
 * Designed to be maintainable and robust against varying language code formats (e.g., "Vi", "En", "vi-VN", "en-US").
 */

export const SUPPORTED_LANGUAGES = ['vi', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'vi';

/**
 * Normalizes a language code string to a supported 2-letter ISO code.
 * Handles cases like "Vi", "En", "vi-VN", "en-US".
 * 
 * @param code - The input language code (e.g. from backend or browser)
 * @returns The normalized language code (e.g. "vi", "en")
 */
export const normalizeLanguageCode = (code?: string | null): SupportedLanguage => {
  if (!code) return DEFAULT_LANGUAGE;

  const normalized = code.toLowerCase().trim().split('-')[0];

  if ((SUPPORTED_LANGUAGES as readonly string[]).includes(normalized)) {
    return normalized as SupportedLanguage;
  }

  return DEFAULT_LANGUAGE;
};
