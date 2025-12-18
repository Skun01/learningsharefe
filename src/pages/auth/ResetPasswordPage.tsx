import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/authService';
import { Button, Input } from '@/components/ui';
import clsx from 'clsx';
import styles from './Auth.module.css';

interface ResetPasswordForm {
  newPassword: string;
  confirmNewPassword: string;
}

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: t('auth.invalidToken') });
    }
  }, [token, t]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;
    setIsLoading(true);
    setMessage(null);
    try {
      await authService.resetPassword({ token, newPassword: data.newPassword });
      setMessage({ type: 'success', text: t('auth.successReset') });
      setTimeout(() => navigate('/login'), 2000);
      setTimeout(() => navigate('/login'), 2000);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      const errorCode = errorObj.message || 'auth.errorReset';
      // If error code translation exists, use it. Otherwise fallback to generic 'auth.errorReset'
      const errorText = t(`errors.${errorCode}`) !== `errors.${errorCode}` ? t(`errors.${errorCode}`) : t('auth.errorReset');
      setMessage({ type: 'error', text: errorText });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('auth.resetPasswordTitle')}</h1>
          <p className={styles.subtitle}>{t('auth.resetPasswordDesc')}</p>
        </div>

        {message && (
          <div className={clsx(styles.errorMessage, message.type === 'success' && styles.successMessage)}
               style={{ backgroundColor: message.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)', color: message.type === 'success' ? 'var(--success-text)' : 'var(--error-text)', borderColor: 'transparent' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <Input
              label={t('auth.newPassword')}
              type="password"
              error={errors.newPassword?.message}
              {...register('newPassword', { 
                required: t('auth.passwordRequired'),
                minLength: { value: 6, message: t('auth.passwordLength') }
              })}
            />
            <Input
              label={t('auth.confirmNewPassword')}
              type="password"
              error={errors.confirmNewPassword?.message}
              {...register('confirmNewPassword', { 
                required: t('auth.passwordRequired'),
                validate: (val: string) => {
                  if (watch('newPassword') != val) {
                    return "Passwords do not match"; // Hardcoded backup or add to trans
                  }
                }
              })}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} disabled={isLoading || !token}>
             {t('auth.resetPasswordBtn')}
          </Button>

          <div className={styles.bottomText}>
            <Link to="/login" className={styles.link}>
              {t('auth.backToLogin')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
