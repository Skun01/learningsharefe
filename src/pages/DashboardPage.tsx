import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Book,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { deckService } from '@/services';
import type { DeckStatisticsDTO } from '@/types';
import { Loading } from '@/components/ui';
import { useToast } from '@/hooks';
import styles from './Dashboard.module.css';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  
  const [deckStats, setDeckStats] = useState<DeckStatisticsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch deck statistics
  useEffect(() => {
    const fetchDeckStats = async () => {
      try {
        setLoading(true);
        const response = await deckService.getStatistics();
        
        if (response.success && response.data) {
          setDeckStats(response.data);
        } else {
          showToast(t('decks.errorLoadStats'), 'error');
        }
      } catch (error) {
        console.error('Failed to fetch deck statistics:', error);
        showToast(t('decks.errorLoadStats'), 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDeckStats();
  }, [t, showToast]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading size="lg" text={t('dashboard.loading')} />
      </div>
    );
  }

  if (!deckStats) {
    return null;
  }

  const progressColor = 
    deckStats.overallProgress >= 75 ? 'green' :
    deckStats.overallProgress >= 50 ? 'yellow' :
    deckStats.overallProgress >= 25 ? 'orange' : 'red';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('dashboard.welcome')}</h1>
        <p className={styles.subtitle}>{t('dashboard.subtitle')}</p>
      </header>

      {/* My Decks Statistics */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('dashboard.myDecks')}</h2>
          <Link to="/decks" className={styles.viewAll}>
            {t('common.viewAll')} <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Book size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{deckStats.totalDecks}</p>
              <p className={styles.statLabel}>{t('decks.totalDecks')}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <BookOpen size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{deckStats.totalCards}</p>
              <p className={styles.statLabel}>{t('decks.totalCards')}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{deckStats.totalLearned}</p>
              <p className={styles.statLabel}>{t('decks.totalLearned')}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Target size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{deckStats.totalDue}</p>
              <p className={styles.statLabel}>{t('decks.totalDue')}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <h3 className={styles.progressTitle}>{t('decks.overallProgress')}</h3>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressFill} ${styles[progressColor]}`}
              style={{ width: `${deckStats.overallProgress}%` }}
            />
          </div>
          <p className={styles.progressText}>
            {deckStats.overallProgress.toFixed(1)}% {t('decks.completed')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <div className={styles.quickStat}>
            <Users size={18} />
            <span>{deckStats.publicDecks} {t('decks.publicDecks')}</span>
          </div>
          <div className={styles.quickStat}>
            <Lock size={18} />
            <span>{deckStats.privateDecks} {t('decks.privateDecks')}</span>
          </div>
        </div>

        {/* CTA to Decks */}
        <div className={styles.ctaSection}>
          <Link to="/decks" className={styles.ctaButton}>
            <Book size={20} />
            {t('dashboard.viewAllDecks')}
          </Link>
        </div>
      </section>
    </div>
  );
};
