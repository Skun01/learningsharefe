import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, TrendingUp, Grid3x3, AlertTriangle, SearchX, Sparkles, X } from 'lucide-react';
import type { PublicDeckDTO, DeckFilters, MetaData } from '@/types/store';
import { storeService } from '@/services';
import { DeckCard, Pagination, DeckDetailModal } from '@/components/store';
import { Loading, Button } from '@/components/ui';
import { useToast } from '@/hooks';
import styles from './Store.module.css';

export const StorePage = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [decks, setDecks] = useState<PublicDeckDTO[]>([]);
  const [trending, setTrending] = useState<PublicDeckDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState(''); // Local state for input

  // Get filters from URL - memoize to prevent infinite loops
  const keyword = searchParams.get('keyword') || '';
  const type = searchParams.get('type') as 'Vocabulary' | 'Grammar' | null;
  const tags = useMemo(() => searchParams.getAll('tags'), [searchParams]);
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Sync searchInput with URL keyword on mount and when keyword changes
  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

  // Debounced search - update URL after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== keyword) {
        updateFilters({ keyword: searchInput, page: 1 });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch decks with error handling
  const fetchDecks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: DeckFilters = {};
      if (keyword) filters.keyword = keyword;
      if (type) filters.type = type;
      if (tags.length > 0) filters.tags = tags;

      const response = await storeService.getDecks({
        ...filters,
        page,
        pageSize: 12,
      });

      if (response.success && response.data) {
        setDecks(response.data);
        setMetaData(response.metaData || null);
        setError(null);
      } else {
        throw new Error(response.message || 'Failed to load decks');
      }
    } catch (err) {
      console.error('Failed to fetch decks:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load decks';
      setError(errorMessage);
      setDecks([]);
      setMetaData(null);
    } finally {
      setLoading(false);
    }
  }, [keyword, type, tags, page]);

  // Fetch trending on mount only
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setTrendingLoading(true);
        const response = await storeService.getTrendingDecks(6);
        if (response.success && response.data) {
          setTrending(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // Fetch decks when filters change
  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // Show error toast when error occurs (separate effect)
  useEffect(() => {
    if (error) {
      showToast(t('store.errorLoadDecks'), 'error');
    }
  }, [error, showToast, t]);

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<DeckFilters & { page: number }>) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (newFilters.keyword !== undefined) {
      if (newFilters.keyword) {
        newParams.set('keyword', newFilters.keyword);
      } else {
        newParams.delete('keyword');
      }
    }

    if (newFilters.type !== undefined) {
      if (newFilters.type) {
        newParams.set('type', newFilters.type);
      } else {
        newParams.delete('type');
      }
    }

    if (newFilters.tags !== undefined) {
      newParams.delete('tags');
      newFilters.tags.forEach(tag => newParams.append('tags', tag));
    }

    if (newFilters.page !== undefined) {
      if (newFilters.page === 1) {
        newParams.delete('page');
      } else {
        newParams.set('page', newFilters.page.toString());
      }
    }

    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    fetchDecks();
  };

  return (
    <div className={styles.container}>
      {/* Hero/Search Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Sparkles className={styles.heroIcon} size={40} />
          <h1 className={styles.title}>{t('store.title')}</h1>
          <p className={styles.subtitle}>{t('store.subtitle')}</p>
        </div>
        
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="search"
            placeholder={t('store.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles.searchInput}
            aria-label={t('store.searchPlaceholder')}
          />
        </div>

        {/* Active search indicator */}
        {keyword && (
          <div className={styles.searchStatus}>
            <p className={styles.searchStatusText}>
              {loading ? (
                t('store.searching')
              ) : metaData ? (
                <>
                  {t('store.found')} <strong>{metaData.total}</strong> {t('store.resultsFor')} "<strong>{keyword}</strong>"
                </>
              ) : (
                t('store.noResults')
              )}
            </p>
            <button
              onClick={() => setSearchInput('')}
              className={styles.clearSearchButton}
              aria-label={t('store.clearSearch')}
            >
              <X size={16} />
              {t('store.clearSearch')}
            </button>
          </div>
        )}
      </section>

      {/* Trending Section - Only show when NOT searching */}
      {!keyword && !trendingLoading && trending.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <TrendingUp size={24} className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>{t('store.trending')}</h2>
            </div>
          </div>
          <div className={styles.trendingGrid}>
            {trending.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                showAuthor={false}
                onClick={() => setSelectedDeckId(deck.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Browse/Search Results Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrapper}>
            {keyword ? (
              <Search size={24} className={styles.sectionIcon} />
            ) : (
              <Grid3x3 size={24} className={styles.sectionIcon} />
            )}
            <h2 className={styles.sectionTitle}>
              {keyword ? t('store.searchResults') : t('store.browse')}
            </h2>
          </div>
          {metaData && !error && !loading && (
            <p className={styles.resultCount}>
              {metaData.total} {keyword ? t('store.resultsFound') : t('store.decksFound')}
            </p>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <Loading size="lg" text={keyword ? t('store.searching') : t('store.loadingDecks')} />
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <AlertTriangle size={48} className={styles.errorIcon} />
            <h3 className={styles.errorTitle}>{t('store.errorLoadDecks')}</h3>
            <p className={styles.errorText}>
              {t('store.errorServerIssue')}
            </p>
            <Button variant="primary" onClick={handleRetry}>
              {t('store.retry')}
            </Button>
          </div>
        ) : !decks || decks.length === 0 ? (
          <div className={styles.emptyState}>
            <SearchX size={64} className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {keyword ? t('store.noSearchResults') : t('store.noDecks')}
            </p>
            <p className={styles.emptyHint}>
              {keyword ? t('store.tryDifferentKeywords') : t('store.tryAdjusting')}
            </p>
            {keyword && (
              <Button variant="outline" onClick={() => setSearchInput('')}>
                {t('store.clearSearch')}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className={styles.deckGrid}>
              {decks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onClick={() => setSelectedDeckId(deck.id)}
                />
              ))}
            </div>

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
      </section>

      {/* Deck Detail Modal */}
      {selectedDeckId && (
        <DeckDetailModal
          deckId={selectedDeckId}
          onClose={() => setSelectedDeckId(null)}
        />
      )}
    </div>
  );
};
