import { useEffect, useState } from 'react';
import type { Toast as ToastType } from '@/contexts/ToastContext';
import styles from './Toast.module.css';
import clsx from 'clsx';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export const Toast = ({ toast, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast.duration) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const decrement = (100 / toast.duration!) * 50; // Update every 50ms
        return Math.max(prev - decrement, 0);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [toast.duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  return (
    <div
      className={clsx(
        styles.toast,
        styles[toast.type],
        isVisible && styles.visible
      )}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.content}>
        <span className={styles.icon} aria-hidden="true">
          {ICONS[toast.type]}
        </span>
        <p className={styles.message}>{toast.message}</p>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
      {toast.duration && (
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
