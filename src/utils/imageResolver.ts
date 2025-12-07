/**
 * Image Resolver Utility
 * Figma Make serverida figma:asset ishlatadi, local'da /public/images/ dan oladi
 */

// Figma asset hash'larini public path'ga map qilish
const assetMap: Record<string, string> = {
  // Click logo (Dashboard payment)
  '2a03e1d9f42a8a77d98665ab2740b6507b408cd2.png': '/images/click-logo.png',
  
  // Hero section background
  '6303e8dcc4b52dc83bedb7876578abe30165231a.png': '/images/hero-image.png',
  
  // Feedback section image
  '7a857004c4db27e89045589b1490b9e5d93c9bac.png': '/images/feedback-image.png',
  
  // Pricing table background (Westminster/Big Ben)
  '3600c3807830360d61d240921531dcdb4a5b4085.png': '/images/westminster-bigben.png',
  
  // Logo/Brand images (from imports folder)
  '6c2bc54b164d85afd1c0449f603d199c57990a3a.png': '/images/logo-rect-3.png',
  'da1683f7feb4ffd86dcc13f6704e5651b65fb7a8.png': '/images/logo-rect-4.png',
};

/**
 * Resolve image source - Figma asset yoki local public path
 */
export function resolveImageSrc(figmaAssetPath: string | undefined, fallbackPath?: string): string {
  // Agar figmaAssetPath yo'q bo'lsa, fallback qaytarish
  if (!figmaAssetPath && fallbackPath) {
    return fallbackPath;
  }
  
  if (!figmaAssetPath) {
    return '';
  }

  // Agar bu allaqachon oddiy path bo'lsa (/ bilan boshlansa), o'zini qaytarish
  if (typeof figmaAssetPath === 'string' && (figmaAssetPath.startsWith('/') || figmaAssetPath.startsWith('http'))) {
    return figmaAssetPath;
  }

  // Agar bu import object bo'lsa (Vite import result)
  if (typeof figmaAssetPath === 'object' && figmaAssetPath !== null && 'default' in figmaAssetPath) {
    return (figmaAssetPath as any).default;
  }

  // Extract hash from figma:asset path
  const hashMatch = figmaAssetPath.toString().match(/figma:asset\/([^"']+)/);
  if (hashMatch && hashMatch[1]) {
    const hash = hashMatch[1];
    // Agar map'da bo'lsa, public path qaytarish
    if (assetMap[hash]) {
      return assetMap[hash];
    }
  }

  // Default: figmaAssetPath'ni o'zini qaytarish (server'da ishlaydi)
  return figmaAssetPath;
}

/**
 * Image hash'ini public path'ga convert qilish
 * Local development uchun: public/images/[filename] ni qaytaradi
 */
export function getLocalImagePath(hash: string, filename: string): string {
  assetMap[hash] = `/images/${filename}`;
  return assetMap[hash];
}
