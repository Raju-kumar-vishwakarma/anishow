// src/lib/analytics.ts
/**
 * Google Analytics Configuration
 * Initialize and track events across the application
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: Record<string, any>[];
  }
}

/**
 * Initialize Google Analytics
 * Add GA script to HTML first
 */
export const initializeAnalytics = () => {
  // Check if gtag is available
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('Google Analytics initialized');
  }
};

/**
 * Track page views
 */
export const trackPageView = (pathname: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-WNP3FGKY3M', {
      page_path: pathname,
      page_title: title,
    });
  }
};

/**
 * Track custom events
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData || {});
  }
};

/**
 * Track anime views
 */
export const trackAnimeView = (animeId: string, animeName: string) => {
  trackEvent('anime_viewed', {
    anime_id: animeId,
    anime_name: animeName,
  });
};

/**
 * Track ad impressions
 */
export const trackAdImpression = (adSlot: string) => {
  trackEvent('ad_impression', {
    ad_slot: adSlot,
  });
};

/**
 * Track searches
 */
export const trackSearch = (searchQuery: string) => {
  trackEvent('search', {
    search_term: searchQuery,
  });
};

/**
 * Track user signups
 */
export const trackSignup = (method: string) => {
  trackEvent('sign_up', {
    method: method,
  });
};

/**
 * Track video plays
 */
export const trackVideoPlay = (videoId: string, videoTitle: string) => {
  trackEvent('video_play', {
    video_id: videoId,
    video_title: videoTitle,
  });
};
