import type { AuthorDTO } from './store';

/**
 * Deck Management Types (User's Personal Decks)
 * Based on Deck API Documentation
 * Note: Prefixed with "User" to avoid conflicts with Store types
 */

// ==================== DTOs ====================

export interface UserDeckSummaryDTO {
  id: number;
  name: string;
  description: string | null;
  type: 'Vocabulary' | 'Grammar';
  author: AuthorDTO;
  stats: DeckStatsDTO;
  tags: string[];
  isPublic: boolean;
  sourceDeckId: number | null;
  createdAt: string; // ISO 8601
}

export interface UserDeckDetailDTO {
  id: number;
  name: string;
  description: string | null;
  type: 'Vocabulary' | 'Grammar';
  isPublic: boolean;
  parentDeckId: number | null;
  tags: string[];
  totalCards: number;
  downloads: number;
  createdAt: string; // ISO 8601
}

export interface DeckStatsDTO {
  totalCards: number;
  downloads: number;
  learned: number;
  progress: number; // 0-100
  cardsDue: number;
}

export interface DeckStatisticsDTO {
  totalDecks: number;
  totalCards: number;
  totalLearned: number;
  totalDue: number;
  overallProgress: number; // 0-100
  publicDecks: number;
  privateDecks: number;
  decksByType: Record<string, number>;
}

// ==================== Request DTOs ====================

export interface CreateDeckDTO {
  name: string;
  description?: string;
  type: 'Vocabulary' | 'Grammar';
  isPublic?: boolean;
  parentDeckId?: number;
  tags?: string[];
}

export interface UpdateDeckDTO {
  name?: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
  // Note: type and parentDeckId are immutable
}

// ==================== Filters & Sorting ====================

export interface UserDeckFilters {
  type?: 'Vocabulary' | 'Grammar';
  isPublic?: boolean;
}

export type DeckSortBy = 'CardsDue' | 'Name' | 'CreatedAt' | 'Progress';
export type SortOrder = 'asc' | 'desc';

export interface DeckSortOptions {
  sortBy?: DeckSortBy;
  sortOrder?: SortOrder;
}

// ==================== Request Params ====================

export interface GetDecksParams extends UserDeckFilters, DeckSortOptions {
  page?: number;
  pageSize?: number;
}
