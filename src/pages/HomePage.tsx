import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import styles from './Home.module.css';

export const HomePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {t('home.title').split('LearningShare')[0]} <span className={styles.highlight}>LearningShare</span>
      </h1>
      <p className={styles.description}>
        {t('home.subtitle')}
      </p>
      
      {!user ? (
        <div className={styles.actions}>
          <Link to="/register">
            <Button size="lg">{t('common.getStarted')}</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">{t('common.login')}</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.userWelcome}>
           <h2 className={styles.welcomeTitle}>{t('home.welcomeBack', { username: user.username })}</h2>
           <p className={styles.welcomeText}>{t('home.readyToContinue')}</p>
           <div className={styles.progressCard}>
              {t('home.dailyGoalProgress', { current: 0, total: user.settings?.dailyGoal ?? 10 })}
           </div>
        </div>
      )}
    </div>
  );
};
