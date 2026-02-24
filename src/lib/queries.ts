import { groq } from 'next-sanity';

// Get all enabled countries
export const countriesQuery = groq`
  *[_type == "country" && enabled == true] | order(name.en asc) {
    _id,
    name,
    code,
    "slug": slug.current,
    description,
    flag,
    image,
    enabled,
    "trekCount": count(*[_type == "trek" && references(^._id)])
  }
`;

// Get a single country by slug
export const countryQuery = groq`
  *[_type == "country" && slug.current == $slug][0] {
    _id,
    name,
    code,
    "slug": slug.current,
    description,
    flag,
    image
  }
`;

// Get all regions for a country
export const regionsQuery = groq`
  *[_type == "region" && country->slug.current == $countrySlug] | order(name.en asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    image,
    "trekCount": count(*[_type == "trek" && references(^._id)])
  }
`;

// Get all treks for a country (with optional filters)
export const treksQuery = groq`
  *[_type == "trek" && country->slug.current == $countrySlug] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "country": country->slug.current,
    "region": region->slug.current,
    "regionName": region->name,
    difficulty,
    duration,
    distance,
    elevation,
    hasRefugio,
    mainImage
  }
`;

// Get featured treks
export const featuredTreksQuery = groq`
  *[_type == "trek" && featured == true] | order(publishedAt desc)[0...6] {
    _id,
    title,
    "slug": slug.current,
    "country": country->slug.current,
    "region": region->slug.current,
    difficulty,
    duration,
    distance,
    mainImage
  }
`;

// Get a single trek by slug
export const trekQuery = groq`
  *[_type == "trek" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "country": country->{
      name,
      code,
      "slug": slug.current
    },
    "region": region->{
      name,
      "slug": slug.current
    },
    difficulty,
    duration,
    distance,
    elevation,
    bestSeason,
    description,
    mainImage,
    gallery,
    coordinates,
    gpxTrack,
    tips,
    essentialInfo,
    externalLinks,
    socialLinks,
    publishedAt
  }
`;

// Get treks by region
export const treksByRegionQuery = groq`
  *[_type == "trek" && region->slug.current == $regionSlug] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "country": country->slug.current,
    "region": region->slug.current,
    difficulty,
    duration,
    distance,
    mainImage
  }
`;

// Get all countries with their regions (for sidebar navigation)
export const countriesWithRegionsQuery = groq`
  *[_type == "country"] | order(name.en asc) {
    _id,
    name,
    code,
    "slug": slug.current,
    flag,
    enabled,
    "regions": *[_type == "region" && references(^._id)] | order(name.en asc) {
      _id,
      name,
      "slug": slug.current
    },
    "trekCount": count(*[_type == "trek" && references(^._id)])
  }
`;

// Search treks by title
export const searchTreksQuery = groq`
  *[_type == "trek" && (lower(title.es) match lower($searchTerm) || lower(title.en) match lower($searchTerm))] | order(publishedAt desc)[0...10] {
    _id,
    title,
    "slug": slug.current,
    "country": country->{
      code,
      flag,
      name
    },
    "region": region->name,
    difficulty,
    mainImage
  }
`;

// Get related treks by country (for proximity calculation)
export const relatedTreksQuery = groq`
  *[_type == "trek" && country->slug.current == $countrySlug && slug.current != $currentSlug] {
    _id,
    title,
    "slug": slug.current,
    "country": country->slug.current,
    "region": region->slug.current,
    difficulty,
    duration,
    distance,
    mainImage,
    coordinates
  }
`;
