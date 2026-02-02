import { useEffect } from 'react';

interface EzoicAdProps {
  placeholderId: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Ezoic Ad Component for displaying Ezoic ads
 * Usage: <EzoicAd placeholderId={100} />
 * 
 * Note: This component renders Ezoic ad placeholders.
 * The placeholderId determines which ad unit is displayed.
 * Make sure to add the Ezoic script in your HTML head tag.
 */
export default function EzoicAd({ 
  placeholderId = 100,
  className = '',
  style = {},
}: EzoicAdProps) {
  
  useEffect(() => {
    // Refresh Ezoic ads if ezstandalone object is available
    if (typeof window !== 'undefined' && (window as any).ezstandalone) {
      try {
        (window as any).ezstandalone.cmd.push(function() {
          (window as any).ezstandalone.define(placeholderId);
          (window as any).ezstandalone.enable();
          (window as any).ezstandalone.display();
        });
      } catch (e) {
        console.log('Ezoic ad initialization:', e);
      }
    }
  }, [placeholderId]);

  return (
    <div 
      className={`ezoic-ad-container ${className}`} 
      style={style}
      id={`ezoic-pub-ad-placeholder-${placeholderId}`}
    >
      {/* Ezoic ad will be injected here */}
    </div>
  );
}
