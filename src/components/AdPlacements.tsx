import AmpAd from './AmpAd';

/**
 * Ad Slots Configuration
 * Different slots for different placements
 */
export const AD_SLOTS = {
  HEADER: '9718137832',        // Header/Hero section
  BETWEEN_GRID: '1377012767',  // Between anime cards/grid
  RESPONSIVE: '1336650167',    // Responsive ad (rspv format)
  ARTICLE: '6314418751',       // Article/Detail page ad (rspv format)
  SERIES: '9023568496',        // Series/Movies listing ad (rspv format) ✨ NEW
  SIDEBAR: '1234567890',       // Sidebar (if added)
  FOOTER: '0987654321',        // Footer area
  VIDEO_PLAYER: '1111111111',  // Video player area
} as const;

interface AdPlacementProps {
  location: keyof typeof AD_SLOTS;
  className?: string;
}

/**
 * Header Ad - Display in Hero/Header section
 */
export function HeaderAd({ className = '' }: { className?: string }) {
  return (
    <div className={`header-ad-wrapper py-4 ${className}`}>
      <AmpAd slot={AD_SLOTS.HEADER} />
    </div>
  );
}

/**
 * Grid Ad - Display between anime cards
 */
export function GridAd({ className = '' }: { className?: string }) {
  return (
    <div className={`grid-ad-wrapper py-8 ${className}`}>
      <AmpAd slot={AD_SLOTS.BETWEEN_GRID} className="mx-auto" />
    </div>
  );
}

/**
 * Responsive Ad - Responsive layout (rspv format)
 */
export function ResponsiveAd({ className = '' }: { className?: string }) {
  return (
    <div className={`responsive-ad-wrapper py-6 ${className}`}>
      <AmpAd slot={AD_SLOTS.RESPONSIVE} />
    </div>
  );
}

/**
 * Article Ad - Display on article/detail pages (rspv format)
 */
export function ArticleAd({ className = '' }: { className?: string }) {
  return (
    <div className={`article-ad-wrapper py-6 ${className}`}>
      <AmpAd slot={AD_SLOTS.ARTICLE} />
    </div>
  );
}

/**
 * Series Ad - Display on series/movies listing pages (rspv format)
 */
export function SeriesAd({ className = '' }: { className?: string }) {
  return (
    <div className={`series-ad-wrapper py-6 ${className}`}>
      <AmpAd slot={AD_SLOTS.SERIES} />
    </div>
  );
}

/**
 * Video Player Ad - Display near video player
 */
export function VideoPlayerAd({ className = '' }: { className?: string }) {
  return (
    <div className={`video-player-ad-wrapper py-4 ${className}`}>
      <AmpAd slot={AD_SLOTS.VIDEO_PLAYER} />
    </div>
  );
}

/**
 * Footer Ad - Display in footer
 */
export function FooterAd({ className = '' }: { className?: string }) {
  return (
    <div className={`footer-ad-wrapper py-4 ${className}`}>
      <AmpAd slot={AD_SLOTS.FOOTER} />
    </div>
  );
}

/**
 * Generic Ad Placement
 */
export function AdPlacement({ location, className = '' }: AdPlacementProps) {
  const slot = AD_SLOTS[location];
  
  return (
    <div className={`ad-placement ad-${location.toLowerCase()} ${className}`}>
      <AmpAd slot={slot} />
    </div>
  );
}

/**
 * Smart Ad - Shows ad between items
 * Useful for lists and grids
 */
interface SmartAdProps {
  itemCount: number;
  showEveryNItems?: number;
  className?: string;
}

export function SmartGridAd({ 
  itemCount, 
  showEveryNItems = 6, 
  className = '' 
}: SmartAdProps) {
  if (itemCount > 0 && itemCount % showEveryNItems === 0) {
    return <GridAd className={className} />;
  }
  return null;
}
