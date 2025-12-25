import { memo } from 'react';
import { BookOpen, Download, User } from 'lucide-react';
import type { PublicDeckDTO } from '@/types/store';
import { getImageUrl } from '@/utils/image';
import styles from './DeckCard.module.css';
import clsx from 'clsx';

interface DeckCardProps {
  deck: PublicDeckDTO;
  variant?: 'grid' | 'list';
  showAuthor?: boolean;
  onClick?: () => void;
}

export const DeckCard = memo(({
  deck,
  variant = 'grid',
  showAuthor = true,
  onClick,
}: DeckCardProps) => {
  return (
    <div
      className={clsx(styles.card, styles[variant])}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{deck.name}</h3>
        <span className={clsx(styles.badge, styles[deck.type.toLowerCase()])}>
          {deck.type}
        </span>
      </div>

      {deck.description && (
        <p className={styles.description}>{deck.description}</p>
      )}

      {showAuthor && (
        <div className={styles.author}>
          {deck.author.avatarUrl ? (
            <img 
              src={getImageUrl(deck.author.avatarUrl)} 
              alt={deck.author.name}
              className={styles.authorAvatar}
            />
          ) : (
            <div className={styles.authorAvatarPlaceholder}>
              <User size={14} />
            </div>
          )}
          <span className={styles.authorName}>{deck.author.name}</span>
        </div>
      )}

      {deck.tags.length > 0 && (
        <div className={styles.tags}>
          {deck.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
          {deck.tags.length > 3 && (
            <span className={styles.tagMore}>+{deck.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <BookOpen size={16} />
            <span>{deck.totalCards}</span>
          </span>
          <span className={styles.stat}>
            <Download size={16} />
            <span>
              {deck.downloads >= 1000 
                ? `${(deck.downloads / 1000).toFixed(1)}k` 
                : deck.downloads}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
});

DeckCard.displayName = 'DeckCard';
