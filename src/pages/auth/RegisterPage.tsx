import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Input, Button } from '@/components/ui';
import type { RegisterRequest } from '@/types';
import { useState } from 'react';
import styles from './Auth.module.css';

export const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterRequest) => {
    setError(null);
    setIsLoading(true);
    try {
      await registerAuth(data);
      navigate('/');
      navigate('/');
      navigate('/');
    } catch (err: unknown) {
      const errorObj = err as { message?: string; response?: { data?: { message?: string } } };
      const errorCode = errorObj.message || 'Registration failed';
      setError(t(`errors.${errorCode}`) !== `errors.${errorCode}` ? t(`errors.${errorCode}`) : (errorObj.response?.data?.message || errorCode));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('auth.createAccount')}</h2>
          <p className={styles.subtitle}>
            {t('auth.joinUs')}
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
              label={t('auth.username')}
              type="text"
              placeholder="johndoe"
              {...register('username', { required: t('auth.usernameRequired') })}
              error={errors.username?.message}
            />
            <Input
              label={t('auth.email')}
              type="email"
              placeholder="user@example.com"
              {...register('email', { 
                required: t('auth.emailRequired'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('auth.invalidEmail')
                }
              })}
              error={errors.email?.message}
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              {...register('password', { required: t('auth.passwordRequired'), minLength: { value: 6, message: t('auth.passwordMinLength')} })}
              error={errors.password?.message}
            />
          </div>

          <Button type="submit" isLoading={isLoading} style={{ width: '100%' }}>
            {t('auth.signUp')}
          </Button>

          <div className={styles.bottomText}>
            <span>{t('auth.hasAccount')} </span>
            <Link to="/login" className={styles.link}>
              {t('auth.signIn')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
