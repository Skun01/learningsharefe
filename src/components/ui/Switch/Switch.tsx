import React from 'react';
import clsx from 'clsx';
import styles from './Switch.module.css';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  id,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      data-state={checked ? 'checked' : 'unchecked'}
      className={clsx(styles.switchRoot, className)}
      onClick={() => {
        if (!disabled) {
          onCheckedChange(!checked);
        }
      }}
    >
      <span className={styles.switchThumb} />
    </button>
  );
};
