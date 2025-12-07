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