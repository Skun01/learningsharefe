import { useState, useEffect } from 'react';
import { X, BookOpen, Download, Calendar, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PublicDeckDetailDTO } from '@/types/store';
import { storeService } from '@/services';
import { Button, Loading } from '@/components/ui';
import { useAuth, useToast } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '@/utils/image';
import styles from './DeckDetailModal.module.css';

interface DeckDetailModalProps {
  deckId: number;
  onClose: () => void;
}

export const DeckDetailModal = ({ deckId, onClose }: DeckDetailModalProps) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [deck, setDeck] = useState<PublicDeckDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        setLoading(true);
        const response = await storeService.getDeckDetail(deckId);
        
        if (response.success && response.data) {
          setDeck(response.data);
        } else {
          showToast(t('store.deckNotFound'), 'error');
          onClose();
        }
      } catch (error) {
        console.error('Failed to fetch deck:', error);
        showToast(t('store.errorLoadDecks'), 'error');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [deckId, t, showToast, onClose]);

  const handleClone = async () => {
    if (!isAuthenticated) {
      showToast(t('store.loginToClone'), 'warning');
      navigate('/login');
      onClose();
      return;
    }

    if (!deck) return;

    try {
      setCloning(true);
      const response = await storeService.cloneDeck(deck.id);
      
      if (response.success) {
        showToast(t('store.cloneSuccess'), 'success');
        onClose();
        // Navigate to the cloned deck (TODO: implement deck detail route)
        // navigate(`/decks/${response.data.id}`);
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

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className={styles.loadingContainer}>
            <Loading size="lg" text={t('store.loadingDeck')} />
          </div>
        ) : deck ? (
          <>
            <div className={styles.header}>
              <div className={styles.headerMain}>
                <h2 className={styles.title}>{deck.name}</h2>
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
                    <User size={16} />
                  </div>
                )}
                <div>
                  <p className={styles.authorLabel}>{t('store.createdBy')}</p>
                  <p className={styles.authorName}>{deck.author.name}</p>
                </div>
              </div>
            </div>

            {deck.description && (
              <div className={styles.section}>
                <p className={styles.description}>{deck.description}</p>
              </div>
            )}

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

            <div className={styles.stats}>
              <div className={styles.stat}>
                <BookOpen size={20} />
                <div>
                  <p className={styles.statValue}>{deck.totalCards}</p>
                  <p className={styles.statLabel}>{t('store.cards')}</p>
                </div>
              </div>
              <div className={styles.stat}>
                <Download size={20} />
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
                <Calendar size={20} />
                <div>
                  <p className={styles.statValue}>
                    {new Date(deck.createdAt).toLocaleDateString()}
                  </p>
                  <p className={styles.statLabel}>{t('store.created')}</p>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <p className={styles.cloneHint}>{t('store.cloneHint')}</p>
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
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
