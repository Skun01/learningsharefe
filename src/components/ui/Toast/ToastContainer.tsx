import { createPortal } from 'react-dom';
import { useToast } from '@/contexts/ToastContext';
import { Toast } from './Toast';
import styles from './ToastContainer.module.css';

export const ToastContainer = () => {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
      ))}
    </div>,
    document.body
  );
};
