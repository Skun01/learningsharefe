import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Book, BookOpen, Target, TrendingUp, Users, Lock } from 'lucide-react';
import { deckService } from '@/services';
import type { DeckStatisticsDTO } from '@/types';
import { Loading } from '@/components/ui';
import { useToast } from '@/hooks';
import styles from './DeckDashboard.module.css';

export const DeckDashboardPage = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [stats, setStats] = useState<DeckStatisticsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await deckService.getStatistics();
        
        if (response.success && response.data) {
          setStats(response.data);
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

    fetchStats();
  }, [t, showToast]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading size="lg" text={t('decks.loadingStats')} />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const progressColor = 
    stats.overallProgress >= 75 ? 'green' :
    stats.overallProgress >= 50 ? 'yellow' :
    stats.overallProgress >= 25 ? 'orange' : 'red';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('decks.dashboard')}</h1>
        <p className={styles.subtitle}>{t('decks.dashboardSubtitle')}</p>
      </header>

      {/* Main Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Book size={24} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statValue}>{stats.totalDecks}</p>
            <p className={styles.statLabel}>{t('decks.totalDecks')}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statValue}>{stats.totalCards}</p>
            <p className={styles.statLabel}>{t('decks.totalCards')}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statValue}>{stats.totalLearned}</p>
            <p className={styles.statLabel}>{t('decks.totalLearned')}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target size={24} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statValue}>{stats.totalDue}</p>
            <p className={styles.statLabel}>{t('decks.totalDue')}</p>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className={styles.progressSection}>
        <h2 className={styles.sectionTitle}>{t('decks.overallProgress')}</h2>
        <div className={styles.progressBar}>
          <div 
            className={`${styles.progressFill} ${styles[progressColor]}`}
            style={{ width: `${stats.overallProgress}%` }}
          />
        </div>
        <p className={styles.progressText}>
          {stats.overallProgress.toFixed(1)}% {t('decks.completed')}
        </p>
      </div>

      {/* Additional Stats */}
      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <div className={styles.detailIcon}>
            <Users size={20} />
          </div>
          <div>
            <p className={styles.detailValue}>{stats.publicDecks}</p>
            <p className={styles.detailLabel}>{t('decks.publicDecks')}</p>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailIcon}>
            <Lock size={20} />
          </div>
          <div>
            <p className={styles.detailValue}>{stats.privateDecks}</p>
            <p className={styles.detailLabel}>{t('decks.privateDecks')}</p>
          </div>
        </div>
      </div>

      {/* By Type */}
      {Object.keys(stats.decksByType).length > 0 && (
        <div className={styles.typeSection}>
          <h2 className={styles.sectionTitle}>{t('decks.byType')}</h2>
          <div className={styles.typeGrid}>
            {Object.entries(stats.decksByType).map(([type, count]) => (
              <div key={type} className={styles.typeCard}>
                <p className={styles.typeLabel}>{type}</p>
                <p className={styles.typeValue}>{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
