import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "video";
}

const DEFAULT_IMAGE = "https://anishow.com/public/favicon.png";

export default function Seo({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  noIndex = false,
  type = "website",
}: SeoProps) {
  const robots = noIndex
    ? "noindex, nofollow, noarchive, nosnippet"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
