// Store API Type Definitions

export interface AuthorDTO {
  id: number;
  name: string;
  avatarUrl?: string;
}

export interface PublicDeckDTO {
  id: number;
  name: string;
  description?: string;
  type: 'Vocabulary' | 'Grammar';
  author: AuthorDTO;
  tags: string[];
  totalCards: number;
  downloads: number;
  createdAt: string;
}

export type PublicDeckDetailDTO = PublicDeckDTO;

export interface TagStatDTO {
  name: string;
  count: number;
}

export interface CloneDeckRequest {
  customName?: string;
}

export interface DeckDetailDTO {
  id: number;
  name: string;
  description?: string;
  type: string;
  isPublic: boolean;
  parentDeckId?: number;
  tags: string[];
  totalCards: number;
  downloads: number;
  createdAt: string;
}

// Filter and pagination types
export interface DeckFilters {
  keyword?: string;
  type?: 'Vocabulary' | 'Grammar';
  tags?: string[];
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface BrowseDecksParams extends DeckFilters, PaginationParams {}

export interface MetaData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message?: string;
  data: T;
  metaData?: MetaData;
}
