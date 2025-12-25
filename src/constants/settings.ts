export const SETTINGS = {
  DEFAULT_DAILY_GOAL: 10,
  SUCCESS_MESSAGE_DURATION: 2000,
  DAILY_GOAL_MIN: 1,
  DAILY_GOAL_MAX: 100,
} as const;

export const LOADING_STATES = {
  GHOST: 'ghost',
  DAILY_GOAL: 'dailyGoal',
  LANGUAGE: 'language',
  AVATAR: 'avatar',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  RETRO: 'retro',
} as const;

export type LoadingState = typeof LOADING_STATES[keyof typeof LOADING_STATES];
export type Theme = typeof THEMES[keyof typeof THEMES];
