import EzoicAd from './AmpAd';

/**
 * Ezoic Ad Placeholders Configuration
 * Different placeholders for different placements
 * Note: Replace these placeholder IDs with your actual Ezoic placeholder IDs from your Ezoic dashboard
 */
export const EZOIC_PLACEHOLDERS = {
  HEADER: 100,        // Header/Hero section
  BETWEEN_GRID: 101,  // Between anime cards/grid
  RESPONSIVE: 102,    // Responsive ad
  ARTICLE: 103,       // Article/Detail page ad
  SERIES: 104,        // Series/Movies listing ad
  SIDEBAR: 105,       // Sidebar (if added)
  FOOTER: 106,        // Footer area
  VIDEO_PLAYER: 107,  // Video player area
} as const;

interface AdPlacementProps {
  location: keyof typeof EZOIC_PLACEHOLDERS;
  className?: string;
}

/**
 * Header Ad - Display in Hero/Header section
 */
export function HeaderAd({ className = '' }: { className?: string }) {
  return (
    <div className={`header-ad-wrapper py-4 ${className}`}>
      <EzoicAd placeholderId={EZOIC_PLACEHOLDERS.HEADER} />
    </div>
  );
}

/**
 * Grid Ad - Display between anime cards
 */
export function GridAd({ className = '' }: { className?: string }) {
  return (
    <div className={`grid-ad-wrapper py-8 ${className}`}>
      <EzoicAd placeholderId={EZOIC_PLACEHOLDERS.BETWEEN_GRID} className="mx-auto" />
    </div>
  );
}

/**
 * Responsive Ad - Responsive layout
 */
export function ResponsiveAd({ className = '' }: { className?: string }) {
  return (
    <div className={`responsive-ad-wrapper py-6 ${className}`}>
      <EzoicAd placeholderId={EZOIC_PLACEHOLDERS.RESPONSIVE} />
    </div>
  );
}

/**
 * Article Ad - Display on article/detail pages
 */
export function ArticleAd({ className = '' }: { className?: string }) {
  return (
    <div className={`article-ad-wrapper py-6 ${className}`}>
      <EzoicAd placeholderId={EZOIC_PLACEHOLDERS.ARTICLE} />
    </div>
  );
}

/**
 * Series Ad - Display on series/movies listing pages
 */
export function SeriesAd({ className = '' }: { className?: string }) {
  return (
    <div className={`series-ad-wrapper py-6 ${className}`}>
      <EzoicAd placeholderId={EZOIC_PLACEHOLDERS.SERIES} />
    </div>
  );
}

/**
 * Video Player Ad - Display near video player
 */
export function VideoPlayerAd({ className = '' }: { className?: string }) {
  return (
    <div className={`video-player-ad-wrapper py-4 ${className}`}>
      <EzoicAd placeholderId={EZOIC_PLACEHOLDERS.VIDEO_PLAYER} />
    </div>
  );
}

/**
 * Footer Ad - Display in footer
 */
export function FooterAd({ className = '' }: { className?: string }) {
  return (
    <div className={`footer-ad-wrapper py-4 ${className}`}>
      <EzoicAd placeholderId={EZOIC_PLACEHOLDERS.FOOTER} />
    </div>
  );
}

/**
 * Generic Ad Placement
 */
export function AdPlacement({ location, className = '' }: AdPlacementProps) {
  const placeholderId = EZOIC_PLACEHOLDERS[location];
  
  return (
    <div className={`ad-placement ad-${location.toLowerCase()} ${className}`}>
      <EzoicAd placeholderId={placeholderId} />
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
