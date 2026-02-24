import { NextResponse } from 'next/server';
import { client, urlForImage } from '@/lib/sanity';
import { searchTreksQuery } from '@/lib/queries';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const treks = await client.fetch(searchTreksQuery);
    const normalizedQuery = normalize(query);

    // Filter with accent-insensitive and case-insensitive matching
    const filtered = treks.filter((trek: any) => {
      const titleEs = normalize(trek.title?.es || '');
      const titleEn = normalize(trek.title?.en || '');
      return titleEs.includes(normalizedQuery) || titleEn.includes(normalizedQuery);
    });

    // Transform results to include image URLs
    const results = filtered.slice(0, 10).map((trek: any) => ({
      _id: trek._id,
      title: trek.title,
      slug: trek.slug,
      country: trek.country,
      region: trek.region,
      difficulty: trek.difficulty,
      mainImage: trek.mainImage ? urlForImage(trek.mainImage).width(100).height(100).url() : null,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching treks:', error);
    return NextResponse.json([], { status: 500 });
  }
}
