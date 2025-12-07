/**
 * Image Resolver - Figma asset, local public, va Unsplash fallback
 * 
 * Priority:
 * 1. Local public/images/ (development)
 * 2. Figma CDN (production on Figma Make)
 * 3. Unsplash placeholder (fallback)
 */

// Unsplash fallback URLs for missing images
const unsplashFallbacks: Record<string, string> = {
  'hero-image.png': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop&q=80',
  'feedback-image.png': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop&q=80',
  'click-logo.png': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=60&fit=crop&q=80',
  'westminster-bigben.png': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=800&fit=crop&q=80',
};

/**
 * Resolve image source - Figma asset yoki local public path
 */
export function resolveImageSrc(figmaAssetPath: string | undefined, fallbackPath?: string): string {
  // Agar figmaAssetPath yo'q bo'lsa, fallback qaytarish
  if (!figmaAssetPath && fallbackPath) {
    console.log('[ImageResolver] Using fallback:', fallbackPath);
    return fallbackPath;
  }
  
  if (!figmaAssetPath) {
    console.log('[ImageResolver] No path provided');
    return '';
  }

  // Agar bu allaqachon oddiy path bo'lsa (/ bilan boshlansa), o'zini qaytarish
  if (typeof figmaAssetPath === 'string' && (figmaAssetPath.startsWith('/') || figmaAssetPath.startsWith('http'))) {
    console.log('[ImageResolver] Already resolved path:', figmaAssetPath);
    
    // IMPORTANT: Agar /src/assets/ path bo'lsa, fallback ishlatish
    // Chunki Vite figma:asset'ni /src/assets/ ga compile qiladi lekin bu papka local'da yo'q
    if (figmaAssetPath.includes('/src/assets/') && fallbackPath) {
      console.log('[ImageResolver] Detected /src/assets/, using fallback:', fallbackPath);
      return fallbackPath;
    }
    
    return figmaAssetPath;
  }

  // Agar bu import object bo'lsa (Vite import result)
  if (typeof figmaAssetPath === 'object' && figmaAssetPath !== null && 'default' in figmaAssetPath) {
    console.log('[ImageResolver] Import object detected:', (figmaAssetPath as any).default);
    return (figmaAssetPath as any).default;
  }

  // Extract hash from figma:asset path
  const hashMatch = figmaAssetPath.toString().match(/figma:asset\/([^"']+)/);
  if (hashMatch && hashMatch[1]) {
    const hash = hashMatch[1];
    console.log('[ImageResolver] Extracted hash:', hash);
    // Agar map'da bo'lsa, public path qaytarish
    if (assetMap[hash]) {
      console.log('[ImageResolver] Mapped to local path:', assetMap[hash]);
      return assetMap[hash];
    } else {
      console.log('[ImageResolver] Hash not in map, using original figma:asset');
    }
  }

  // Default: figmaAssetPath'ni o'zini qaytarish (server'da ishlaydi)
  console.log('[ImageResolver] Returning original path:', figmaAssetPath);
  return figmaAssetPath;
}

/**
 * Get Unsplash fallback URL for image filename
 */
export function getUnsplashFallback(filename: string): string {
  return unsplashFallbacks[filename] || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&h=600&fit=crop&q=80';
}

/**
 * Check if image exists at path (client-side only)
 * Returns promise that resolves to true if image loads, false otherwise
 */
export function checkImageExists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = path;
  });
}

/**
 * Advanced image resolver with automatic fallback to Unsplash
 * Usage: const src = await resolveImageWithFallback('/images/hero.png', 'hero-image.png');
 */
export async function resolveImageWithFallback(
  primaryPath: string,
  filename: string
): Promise<string> {
  // Try primary path first
  const exists = await checkImageExists(primaryPath);
  
  if (exists) {
    console.log('[ImageResolver] Image found:', primaryPath);
    return primaryPath;
  }
  
  // Fallback to Unsplash
  const unsplashUrl = getUnsplashFallback(filename);
  console.log('[ImageResolver] Image not found, using Unsplash fallback:', unsplashUrl);
  return unsplashUrl;
}