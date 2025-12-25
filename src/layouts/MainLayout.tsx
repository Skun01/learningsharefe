import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import clsx from 'clsx';
import { getImageUrl } from '@/utils/image';
import styles from './Layout.module.css';

export const MainLayout = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();


  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logo}>
            LearningShare
          </Link>
          
          <nav className={styles.nav}>
             {/* Only show Lang Switcher if NOT logged in */}
            {!user && (
              <div className={styles.langSwitcher}>
                 <button 
                    className={clsx(styles.langBtn, i18n.language === 'en' && styles.activeLang)}
                    onClick={() => changeLanguage('en')}
                    aria-label="Switch to English"
                    aria-pressed={i18n.language === 'en'}
                 >
                   EN
                 </button>
                 <span className={styles.divider}>|</span>
                 <button 
                    className={clsx(styles.langBtn, i18n.language === 'vi' && styles.activeLang)}
                    onClick={() => changeLanguage('vi')}
                    aria-label="Chuyển sang Tiếng Việt"
                    aria-pressed={i18n.language === 'vi'}
                 >
                   VI
                 </button>
              </div>
            )}

            {user ? (
              <div className={styles.userControls}>
                <Link to="/settings" className={styles.userSection}>
                   {user.avatarUrl ? (
                     <img src={getImageUrl(user.avatarUrl)} alt="Avatar" className={styles.avatar} />
                   ) : (
                     <div className={styles.avatarPlaceholder}>{user.username.charAt(0).toUpperCase()}</div>
                   )}
                   <span className={styles.username}>{user.username}</span>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">{t('common.login')}</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
