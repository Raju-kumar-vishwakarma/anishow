# Ezoic Ads Integration Guide

## Overview
Google AdSense has been successfully replaced with Ezoic ads across your AniShow application.

## What Changed

### 1. HTML Head Changes (`index.html`)
- ✅ Removed Google AdSense scripts
- ✅ Removed AMP Ad library
- ✅ Added Ezoic script: `https://www.ezojs.com/ezoic/sa.min.js`
- ✅ Updated DNS prefetch to Ezoic domains
- ✅ Removed Google AdSense account meta tags

### 2. Component Updates

#### `src/components/AmpAd.tsx` → Now `EzoicAd` Component
- ✅ Replaced Google AdSense ad implementation with Ezoic
- ✅ Changed from slot-based system to placeholder IDs
- ✅ Updated initialization logic for Ezoic
- ✅ Removed AMP-specific code
- ✅ Removed AdSense component

#### `src/components/AdPlacements.tsx`
- ✅ Updated all ad slots to use Ezoic placeholder IDs
- ✅ Changed configuration from `AD_SLOTS` to `EZOIC_PLACEHOLDERS`
- ✅ All ad components now use `EzoicAd` instead of `AmpAd`

## Ezoic Placeholder IDs

The following placeholder IDs are configured (you'll need to create these in your Ezoic dashboard):

```typescript
EZOIC_PLACEHOLDERS = {
  HEADER: 100,        // Header/Hero section
  BETWEEN_GRID: 101,  // Between anime cards/grid
  RESPONSIVE: 102,    // Responsive ad
  ARTICLE: 103,       // Article/Detail page ad
  SERIES: 104,        // Series/Movies listing ad
  SIDEBAR: 105,       // Sidebar
  FOOTER: 106,        // Footer area
  VIDEO_PLAYER: 107,  // Video player area
}
```

## Setup Instructions

### Step 1: Create Ezoic Account
1. Sign up at [Ezoic.com](https://www.ezoic.com/)
2. Add your website domain
3. Complete the verification process

### Step 2: Configure Ad Placeholders
1. Log in to your Ezoic dashboard
2. Go to **Ad Tester** → **Placeholders**
3. Create placeholders with IDs matching those in `EZOIC_PLACEHOLDERS`:
   - Placeholder 100: Header Ad
   - Placeholder 101: Grid Ad (between content)
   - Placeholder 102: Responsive Ad
   - Placeholder 103: Article/Detail Page Ad
   - Placeholder 104: Series/Movies Listing Ad
   - Placeholder 105: Sidebar Ad
   - Placeholder 106: Footer Ad
   - Placeholder 107: Video Player Ad

### Step 3: Update Ezoic Script (if needed)
If Ezoic provides you with a custom script URL, update it in `index.html`:
```html
<script async src="YOUR_CUSTOM_EZOIC_SCRIPT_URL"></script>
```

### Step 4: Optional - Update Placeholder IDs
If you want to use different placeholder IDs, edit `src/components/AdPlacements.tsx`:
```typescript
export const EZOIC_PLACEHOLDERS = {
  HEADER: YOUR_HEADER_ID,
  BETWEEN_GRID: YOUR_GRID_ID,
  // ... etc
}
```

## Ad Placement Locations

Ads are currently placed in:
- **Index/Home Page** (`src/pages/Index.tsx`): HeaderAd, GridAd, ResponsiveAd
- **Movies Page** (`src/pages/Movies.tsx`): SeriesAd, GridAd
- **Series Page** (`src/pages/Series.tsx`): SeriesAd, GridAd
- **Anime Detail Page** (`src/pages/AnimeDetail.tsx`): ArticleAd

## Testing

1. Run your development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

2. Visit different pages to see where ads will appear:
   - `/` - Home page with header and grid ads
   - `/movies` - Movies page with series ads
   - `/series` - Series page with listing ads
   - `/anime/[id]` - Detail page with article ads

3. Note: In development, you may not see actual ads until:
   - The site is live on your domain
   - Ezoic has approved your placeholders
   - You've completed Ezoic integration

## Ezoic Features

Once integrated, you'll have access to:
- **Ad Tester**: Optimize ad placements automatically
- **Big Data Analytics**: Detailed revenue and performance metrics
- **Site Speed Accelerator**: CDN and caching
- **EPMV Dashboard**: Earnings per thousand visitors
- **Mediation**: Compare multiple ad networks

## Troubleshooting

### Ads not showing?
1. Check that Ezoic script is loading in Network tab
2. Verify placeholder IDs match your Ezoic dashboard
3. Ensure your domain is verified in Ezoic
4. Check if you're using AdBlock (disable for testing)

### Console errors?
1. Open DevTools Console
2. Look for Ezoic-related errors
3. Ensure `window.ezstandalone` is defined
4. Check that placeholders exist in Ezoic dashboard

### Need different ad sizes?
Ezoic automatically optimizes ad sizes based on:
- Device type (mobile, tablet, desktop)
- Screen size
- User behavior
- Revenue optimization

## Support

- **Ezoic Support**: [support.ezoic.com](https://support.ezoic.com)
- **Ezoic Documentation**: [ezoic.com/learn](https://www.ezoic.com/learn/)
- **Community**: Ezoic Publisher Forum

## Notes

- The component file is still named `AmpAd.tsx` but now exports `EzoicAd` (you can rename it to `EzoicAd.tsx` if desired)
- All Google AdSense references have been removed
- Ezoic handles responsive sizing automatically
- You can add more placeholders as needed by extending `EZOIC_PLACEHOLDERS`

---

**Last Updated**: February 3, 2026
**Migration**: Google AdSense → Ezoic
