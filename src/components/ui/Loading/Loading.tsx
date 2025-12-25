import styles from './Loading.module.css';
import clsx from 'clsx';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading = ({ 
  fullScreen = false, 
  text = 'Loading...', 
  size = 'md',
  className 
}: LoadingProps) => {
  return (
    <div 
      className={clsx(
        styles.container,
        fullScreen && styles.fullScreen,
        styles[size],
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className={styles.spinnerWrapper}>
        <svg 
          className={styles.spinner} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className={styles.spinnerCircle} 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className={styles.spinnerPath} 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};
