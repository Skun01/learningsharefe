import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/authService';
import { Button, Input } from '@/components/ui';
import clsx from 'clsx';
import styles from './Auth.module.css';

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setMessage(null);
    try {
      await authService.forgotPassword(data);
      setMessage({ type: 'success', text: t('auth.successForgot') });
      setMessage({ type: 'success', text: t('auth.successForgot') });
      setMessage({ type: 'success', text: t('auth.successForgot') });
    } catch (err: unknown) {
       const errorObj = err as { message?: string };
       const errorCode = errorObj.message || 'auth.errorForgot';
       const errorText = t(`errors.${errorCode}`) !== `errors.${errorCode}` ? t(`errors.${errorCode}`) : t('auth.errorForgot');
      setMessage({ type: 'error', text: errorText });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('auth.forgotPasswordTitle')}</h1>
          <p className={styles.subtitle}>{t('auth.forgotPasswordDesc')}</p>
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
              label={t('auth.email')}
              type="email"
              error={errors.email?.message}
              {...register('email', { 
                required: t('auth.emailRequired'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('auth.emailInvalid')
                }
              })}
              placeholder={t('auth.emailPlaceholder')}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} disabled={isLoading}>
            {t('auth.sendResetLink')}
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
