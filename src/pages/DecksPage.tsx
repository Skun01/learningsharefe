import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  BookOpen,
  Languages,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  SearchX,
} from 'lucide-react';
import { deckService } from '@/services';
import type { UserDeckSummaryDTO, MetaData, DeckSortBy, SortOrder } from '@/types';
import { Loading, Button } from '@/components/ui';
import { Pagination } from '@/components/store';
import { useToast } from '@/hooks';
import styles from './Decks.module.css';

type DeckType = 'Grammar' | 'Vocabulary';
type FilterType = 'all' | 'mine' | 'public';

export const DecksPage = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [decks, setDecks] = useState<UserDeckSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metaData, setMetaData] = useState<MetaData | null>(null);

  // URL params
  const activeTab = (searchParams.get('type') as DeckType) || 'Grammar';
  const filter = (searchParams.get('filter') as FilterType) || 'all';
  const sortBy = (searchParams.get('sortBy') as DeckSortBy) || 'CardsDue';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Update URL params
  const updateParams = (updates: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  // Fetch decks
  const fetchDecks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await deckService.getDecks({
        type: activeTab,
        isPublic: filter === 'public' ? true : filter === 'mine' ? false : undefined,
        sortBy,
        sortOrder,
        page,
        pageSize: 12,
      });

      if (response.success && response.data) {
        setDecks(response.data);
        // API returns totalPage but MetaData expects totalPages
        if (response.metaData) {
          const apiMeta = response.metaData as { page: number; pageSize: number; total: number; totalPage?: number; totalPages?: number };
          setMetaData({
            page: apiMeta.page,
            pageSize: apiMeta.pageSize,
            total: apiMeta.total,
            totalPages: apiMeta.totalPages ?? apiMeta.totalPage ?? 1,
          });
        } else {
          setMetaData(null);
        }
      } else {
        setError(response.message || 'Failed to fetch decks');
        setDecks([]);
      }
    } catch (err) {
      console.error('Failed to fetch decks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch decks');
      setDecks([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filter, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // Show error toast only when error changes
  useEffect(() => {
    if (error) {
      showToast(t('decks.errorLoadDecks'), 'error');
    }
  }, [error, showToast, t]);

  // Handlers
  const handleTabChange = (type: DeckType) => {
    updateParams({ type, page: 1 });
  };

  const handleFilterChange = (newFilter: FilterType) => {
    updateParams({ filter: newFilter, page: 1 });
  };

  const handleSortChange = (newSortBy: DeckSortBy) => {
    updateParams({ sortBy: newSortBy, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'green';
    if (progress >= 50) return 'yellow';
    if (progress >= 25) return 'orange';
    return 'red';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{t('decks.myDecks')}</h1>
          <Button variant="primary" className={styles.createBtn}>
            <Plus size={18} />
            {t('decks.newDeck')}
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'Grammar' ? styles.active : ''}`}
          onClick={() => handleTabChange('Grammar')}
        >
          <Languages size={20} />
          {t('decks.grammar')}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'Vocabulary' ? styles.active : ''}`}
          onClick={() => handleTabChange('Vocabulary')}
        >
          <BookOpen size={20} />
          {t('decks.vocabulary')}
        </button>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as FilterType)}
            className={styles.select}
          >
            <option value="all">{t('decks.allDecks')}</option>
            <option value="mine">{t('decks.myDecksOnly')}</option>
            <option value="public">{t('decks.publicDecks')}</option>
          </select>
        </div>

        <div className={styles.sortGroup}>
          <ArrowUpDown size={16} />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as DeckSortBy)}
            className={styles.select}
          >
            <option value="CardsDue">{t('decks.sortCardsDue')}</option>
            <option value="Name">{t('decks.sortName')}</option>
            <option value="Progress">{t('decks.sortProgress')}</option>
            <option value="CreatedAt">{t('decks.sortCreatedAt')}</option>
          </select>
        </div>

        {metaData && (
          <p className={styles.resultCount}>
            {metaData.total} {t('decks.decksFound')}
          </p>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading size="lg" text={t('decks.loadingDecks')} />
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h3 className={styles.errorTitle}>{t('decks.errorLoadDecks')}</h3>
          <Button variant="primary" onClick={fetchDecks}>
            {t('decks.retry')}
          </Button>
        </div>
      ) : decks.length === 0 ? (
        <div className={styles.emptyState}>
          <SearchX size={64} className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>
            {activeTab === 'Grammar' ? t('decks.emptyGrammar') : t('decks.emptyVocabulary')}
          </h3>
          <p className={styles.emptyText}>{t('decks.createFirst')}</p>
          <Button variant="primary">
            <Plus size={18} />
            {t('decks.newDeck')}
          </Button>
        </div>
      ) : (
        <>
          {/* Deck Grid */}
          <div className={styles.deckGrid}>
            {decks.map((deck) => (
              <div key={deck.id} className={styles.deckCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.deckName}>{deck.name}</h3>
                  {deck.stats.cardsDue > 0 && (
                    <span className={styles.dueBadge}>
                      {deck.stats.cardsDue} {t('decks.due')}
                    </span>
                  )}
                </div>

                {deck.description && (
                  <p className={styles.deckDescription}>{deck.description}</p>
                )}

                {/* Progress Bar */}
                <div className={styles.progressWrapper}>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${styles[getProgressColor(deck.stats.progress)]}`}
                      style={{ width: `${deck.stats.progress}%` }}
                    />
                  </div>
                  <span className={styles.progressText}>{deck.stats.progress.toFixed(0)}%</span>
                </div>

                {/* Stats */}
                <div className={styles.statsRow}>
                  <span>{deck.stats.totalCards} {t('decks.cards')}</span>
                  <span>{deck.stats.learned} {t('decks.learned')}</span>
                  <span className={deck.isPublic ? styles.public : styles.private}>
                    {deck.isPublic ? t('decks.public') : t('decks.private')}
                  </span>
                </div>

                {/* Tags */}
                {deck.tags.length > 0 && (
                  <div className={styles.tags}>
                    {deck.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                    {deck.tags.length > 3 && (
                      <span className={styles.tagMore}>+{deck.tags.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className={styles.actions}>
                  <Button variant="primary" size="sm" className={styles.studyBtn}>
                    {t('decks.study')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('decks.edit')}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {metaData && metaData.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={metaData.totalPages}
              totalItems={metaData.total}
              itemsPerPage={metaData.pageSize}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};
