import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft, SearchX } from 'lucide-react';
import { Button } from '@/components/ui';
import styles from './NotFound.module.css';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <SearchX size={80} />
        </div>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>{t('notFound.title')}</h2>
        <p className={styles.description}>{t('notFound.description')}</p>
        
        <div className={styles.actions}>
          <Link to="/">
            <Button variant="primary" size="lg">
              <Home size={18} />
              {t('notFound.goHome')}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            {t('notFound.goBack')}
          </Button>
        </div>
      </div>
    </div>
  );
};
