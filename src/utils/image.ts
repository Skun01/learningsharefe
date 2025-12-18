export const getImageUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  // Get base URL from env (use IMAGE_BASE_URL or fallback to stripping /api from API_URL)
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 
                 (import.meta.env.VITE_API_URL || 'http://localhost:5212').replace(/\/api\/?$/, '');
  
  // Ensure we don't have double slashes
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  
  return `${cleanBase}/${cleanPath}`;
};
