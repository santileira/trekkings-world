import { NextResponse } from 'next/server';
import { client, urlForImage } from '@/lib/sanity';
import { searchTreksQuery } from '@/lib/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const treks = await client.fetch(searchTreksQuery, { searchTerm: `*${query}*` });

    // Transform results to include image URLs
    const results = treks.map((trek: any) => ({
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
