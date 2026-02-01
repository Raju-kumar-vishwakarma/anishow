import { useEffect } from 'react';

// Define AMP ad element type
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'amp-ad': AmpAdElement;
    }
  }
}

interface AmpAdElement
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  width?: string | number;
  height?: string | number;
  type?: string;
  'data-ad-client'?: string;
  'data-ad-slot'?: string;
  'data-auto-format'?: string;
  'data-full-width'?: string;
}

interface AmpAdProps {
  slot?: string;
  className?: string;
  style?: React.CSSProperties;
  format?: 'mcrspv' | 'rspv' | 'auto';
}

/**
 * AMP Ad Component for displaying Google AdSense ads
 * Usage: <AmpAd slot="9718137832" format="rspv" />
 * 
 * Note: This component renders AMP ad elements and requires the AMP script in the head tag.
 * The slot ID determines which ad unit is displayed.
 */
export default function AmpAd({ 
  slot = '9718137832',
  className = '',
  style = {},
  format = 'mcrspv'
}: AmpAdProps) {
  
  useEffect(() => {
    // Reload AMP ads if amp object is available
    if ((window as any).amp && (window as any).amp.Ad) {
      try {
        (window as any).amp.Ad.init();
      } catch (e) {
        console.log('AMP ad initialization:', e);
      }
    }
  }, [slot, format]);

  return (
    <div className={`amp-ad-container ${className}`} style={style}>
      <amp-ad 
        width="100vw" 
        height="320"
        type="adsense"
        data-ad-client="ca-pub-3831019899205461"
        data-ad-slot={slot}
        data-auto-format={format}
        data-full-width=""
      >
        <div overflow=""></div>
      </amp-ad>
    </div>
  );
}

/**
 * Alternative: Standard Google AdSense Component
 * If you prefer to use standard Google AdSense instead of AMP ads,
 * use the AdSenseAd component below and add the script to your page
 */

interface AdSenseAdProps {
  slot?: string;
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
}

export function AdSenseAd({
  slot = '9718137832',
  className = '',
  style = {},
  responsive = true,
}: AdSenseAdProps) {
  
  useEffect(() => {
    // Push the ad to AdSense
    const adsbygoogle = (window as any).adsbygoogle;
    if (adsbygoogle) {
      try {
        adsbygoogle.push({});
      } catch (e) {
        console.log('AdSense push error:', e);
      }
    }
  }, [slot, responsive]);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className={`adsbygoogle ${responsive ? 'responsive-ad' : ''}`}
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client="ca-pub-3831019899205461"
        data-ad-slot={slot}
        data-ad-format={responsive ? 'auto' : 'horizontal'}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      ></ins>
    </div>
  );
}
