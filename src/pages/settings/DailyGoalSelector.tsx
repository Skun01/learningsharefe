import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import styles from './Settings.module.css';

interface DailyGoalSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const GOAL_OPTIONS = [
  { value: 10, key: 'casual', emoji: '☕' },
  { value: 30, key: 'regular', emoji: '📚' },
  { value: 50, key: 'serious', emoji: '🚀' },
  { value: 100, key: 'insane', emoji: '🔥' },
];

export const DailyGoalSelector: React.FC<DailyGoalSelectorProps> = ({
  value,
  onChange,
  disabled
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.goalGrid}>
      {GOAL_OPTIONS.map((option) => (
        <div
          key={option.value}
          className={clsx(
            styles.goalCard,
            value === option.value && styles.activeGoal
          )}
          onClick={() => !disabled && onChange(option.value)}
          role="button"
          aria-pressed={value === option.value}
        >
          <span className={styles.goalEmoji}>{option.emoji}</span>
          <span className={styles.goalValue}>{option.value} XP</span>
          <span className={styles.goalLabel}>{t(`settings.goals.${option.key}`)}</span>
        </div>
      ))}
    </div>
  );
};
