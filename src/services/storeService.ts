import api from './api';
import type {
  PublicDeckDTO,
  PublicDeckDetailDTO,
  TagStatDTO,
  DeckDetailDTO,
  BrowseDecksParams,
  CloneDeckRequest,
  ApiResponse,
} from '@/types/store';

/**
 * Store Service - API calls for public deck marketplace
 */

/**
 * Browse public decks with filters and pagination
 */
export const getDecks = async (params: BrowseDecksParams = {}) => {
  const { data } = await api.get<ApiResponse<PublicDeckDTO[]>>('/store/decks', {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword,
      type: params.type,
      tags: params.tags,
    },
    paramsSerializer: {
      indexes: null, // For arrays: tags=JLPT&tags=N5
    },
  });
  return data;
};

/**
 * Get trending decks (most downloads)
 */
export const getTrendingDecks = async (limit: number = 10) => {
  const { data } = await api.get<ApiResponse<PublicDeckDTO[]>>(
    '/store/decks/trending',
    {
      params: { limit },
    }
  );
  return data;
};

/**
 * Get popular tags with usage count
 */
export const getPopularTags = async (limit: number = 20) => {
  const { data } = await api.get<ApiResponse<TagStatDTO[]>>('/store/tags', {
    params: { limit },
  });
  return data;
};

/**
 * Get deck detail by ID
 */
export const getDeckDetail = async (id: number) => {
  const { data } = await api.get<ApiResponse<PublicDeckDetailDTO>>(
    `/store/decks/${id}`
  );
  return data;
};

/**
 * Clone deck to user's library
 */
export const cloneDeck = async (id: number, customName?: string) => {
  const payload: CloneDeckRequest = customName ? { customName } : {};
  const { data } = await api.post<ApiResponse<DeckDetailDTO>>(
    `/store/decks/${id}/clone`,
    payload
  );
  return data;
};

export default {
  getDecks,
  getTrendingDecks,
  getPopularTags,
  getDeckDetail,
  cloneDeck,
};
