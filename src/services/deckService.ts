import api from './api';
import type {
  UserDeckSummaryDTO,
  UserDeckDetailDTO,
  DeckStatisticsDTO,
  CreateDeckDTO,
  UpdateDeckDTO,
  GetDecksParams,
  ApiResponse,
} from '@/types';

/**
 * Deck Service - API calls for managing user's decks
 * Based on Deck API Documentation
 */

/**
 * Get user's decks with filters, sorting, and pagination
 */
export const getDecks = async (params: GetDecksParams = {}) => {
  const { data } = await api.get<ApiResponse<UserDeckSummaryDTO[]>>('/decks', {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      type: params.type,
      isPublic: params.isPublic,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
  });
  return data;
};

/**
 * Get deck detail by ID
 */
export const getDeckById = async (id: number) => {
  const { data } = await api.get<ApiResponse<UserDeckDetailDTO>>(`/decks/${id}`);
  return data;
};

/**
 * Get overall statistics for user's decks
 */
export const getStatistics = async () => {
  const { data } = await api.get<ApiResponse<DeckStatisticsDTO>>(
    '/decks/statistics'
  );
  return data;
};

/**
 * Create a new deck
 */
export const createDeck = async (payload: CreateDeckDTO) => {
  const { data } = await api.post<ApiResponse<UserDeckDetailDTO>>('/decks', payload);
  return data;
};

/**
 * Update an existing deck
 * Note: type and parentDeckId cannot be updated
 */
export const updateDeck = async (id: number, payload: UpdateDeckDTO) => {
  const { data } = await api.put<ApiResponse<UserDeckDetailDTO>>(
    `/decks/${id}`,
    payload
  );
  return data;
};

/**
 * Toggle deck visibility (publish/unpublish)
 */
export const togglePublish = async (id: number) => {
  const { data } = await api.patch<ApiResponse<UserDeckDetailDTO>>(
    `/decks/${id}/publish`
  );
  return data;
};

/**
 * Delete a deck and all related data
 * Warning: This deletes cards, examples, progress for all users
 */
export const deleteDeck = async (id: number) => {
  const { data} = await api.delete<ApiResponse<boolean>>(`/decks/${id}`);
  return data;
};

/**
 * Reset learning progress for a deck
 * Deletes UserCardProgress but keeps cards intact
 */
export const resetProgress = async (id: number) => {
  const { data } = await api.post<ApiResponse<boolean>>(`/decks/${id}/reset`);
  return data;
};

export default {
  getDecks,
  getDeckById,
  getStatistics,
  createDeck,
  updateDeck,
  togglePublish,
  deleteDeck,
  resetProgress,
};
