import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Input, Button } from '@/components/ui';
import type { LoginRequest } from '@/types';
import { useState } from 'react';
import styles from './Auth.module.css';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginRequest) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(data);
      navigate('/');
      navigate('/');
      navigate('/');
    } catch (err: unknown) {
      // The error message is now the backend code (e.g., 'Invalid_400') thanks to the interceptor
      const errorObj = err as { message?: string; response?: { data?: { message?: string } } };
      const errorCode = errorObj.message || 'Login failed';
      // Try to translate the error code, fallback to the code itself if translation key missing (default behavior of t)
      setError(t(`errors.${errorCode}`) !== `errors.${errorCode}` ? t(`errors.${errorCode}`) : (errorObj.response?.data?.message || errorCode));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('auth.welcomeBack')}</h2>
          <p className={styles.subtitle}>
            {t('auth.signInSubtitle')}
          </p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <Input
              label={t('auth.email')}
              type="email"
              placeholder="user@example.com"
              {...register('email', { required: t('auth.emailRequired') })}
              error={errors.email?.message}
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              {...register('password', { required: t('auth.passwordRequired') })}
              error={errors.password?.message}
            />
          </div>

          <div className={styles.footer}>
            <Link to="/forgot-password" className={styles.link}>
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading} style={{ width: '100%' }}>
            {t('auth.signIn')}
          </Button>

          <div className={styles.bottomText}>
            <span>{t('auth.noAccount')} </span>
            <Link to="/register" className={styles.link}>
              {t('auth.signUp')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
