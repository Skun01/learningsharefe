import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PublicDeckDetailDTO } from '@/types/store';
import { storeService } from '@/services';
import { Button, Loading } from '@/components/ui';
import { useToast } from '@/hooks';
import { useAuth } from '@/hooks';
import { getImageUrl } from '@/utils/image';
import styles from './DeckDetail.module.css';

export const DeckDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const [deck, setDeck] = useState<PublicDeckDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDeck = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);
        const response = await storeService.getDeckDetail(parseInt(id, 10));
        
        if (response.success) {
          setDeck(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch deck:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [id]);

  const handleClone = async () => {
    if (!isAuthenticated) {
      showToast(t('store.loginToClone'), 'warning');
      navigate('/login');
      return;
    }

    if (!deck) return;

    try {
      setCloning(true);
      const response = await storeService.cloneDeck(deck.id);
      
      if (response.success) {
        showToast(t('store.cloneSuccess'), 'success');
        // Navigate to the cloned deck (TODO: implement deck detail route)
        navigate(`/decks/${response.data.id}`);
      } else {
        showToast(response.message || t('store.cloneFailed'), 'error');
      }
    } catch (error) {
      console.error('Failed to clone deck:', error);
      showToast(t('store.cloneFailed'), 'error');
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading fullScreen text={t('store.loadingDeck')} />
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>😕 {t('store.deckNotFound')}</h1>
          <p className={styles.errorText}>{t('store.deckNotFoundDesc')}</p>
          <Link to="/store">
            <Button variant="primary">{t('store.backToStore')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link to="/store" className={styles.backLink}>
        ← {t('store.backToStore')}
      </Link>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <h1 className={styles.title}>{deck.name}</h1>
            <span className={styles.badge}>{deck.type}</span>
          </div>

          <div className={styles.author}>
            {deck.author.avatarUrl ? (
              <img
                src={getImageUrl(deck.author.avatarUrl)}
                alt={deck.author.name}
                className={styles.authorAvatar}
              />
            ) : (
              <div className={styles.authorAvatarPlaceholder}>
                {deck.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className={styles.authorLabel}>{t('store.createdBy')}</p>
              <p className={styles.authorName}>{deck.author.name}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {deck.description && (
          <div className={styles.section}>
            <p className={styles.description}>{deck.description}</p>
          </div>
        )}

        {/* Tags */}
        {deck.tags.length > 0 && (
          <div className={styles.section}>
            <div className={styles.tags}>
              {deck.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>📚</span>
            <div>
              <p className={styles.statValue}>{deck.totalCards}</p>
              <p className={styles.statLabel}>{t('store.cards')}</p>
            </div>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>⬇</span>
            <div>
              <p className={styles.statValue}>
                {deck.downloads >= 1000
                  ? `${(deck.downloads / 1000).toFixed(1)}k`
                  : deck.downloads}
              </p>
              <p className={styles.statLabel}>{t('store.downloads')}</p>
            </div>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>📅</span>
            <div>
              <p className={styles.statValue}>
                {new Date(deck.createdAt).toLocaleDateString()}
              </p>
              <p className={styles.statLabel}>{t('store.created')}</p>
            </div>
          </div>
        </div>

        {/* Clone Action */}
        <div className={styles.actionSection}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleClone}
            isLoading={cloning}
            disabled={cloning}
            className={styles.cloneButton}
          >
            {cloning ? t('store.cloning') : t('store.cloneToLibrary')}
          </Button>
          <p className={styles.cloneHint}>{t('store.cloneHint')}</p>
        </div>
      </div>
    </div>
  );
};
