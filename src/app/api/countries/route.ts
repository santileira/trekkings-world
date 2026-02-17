import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { countriesWithRegionsQuery } from '@/lib/queries';

export async function GET() {
  try {
    const countries = await client.fetch(countriesWithRegionsQuery);
    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json([], { status: 500 });
  }
}
