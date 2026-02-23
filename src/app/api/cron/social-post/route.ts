import { NextResponse } from 'next/server';
import { runAutomatedPublish, getEnabledPlatforms } from '@/lib/social-automation';
import type { Locale } from '@/lib/social-automation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Verify the request is from Vercel Cron or has valid secret
function isAuthorized(request: Request): boolean {
  // Vercel Cron sends this header
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  // Also check for Vercel's cron signature
  const vercelCronSignature = request.headers.get('x-vercel-cron');
  if (vercelCronSignature === '1') {
    return true;
  }

  // For development, allow localhost
  const host = request.headers.get('host') || '';
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return true;
  }

  return false;
}

export async function GET(request: Request) {
  // Authorization check
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Check if any platforms are enabled
    const enabledPlatforms = getEnabledPlatforms();
    if (enabledPlatforms.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No social platforms are configured',
        hint: 'Set BLUESKY_HANDLE and BLUESKY_APP_PASSWORD environment variables',
      });
    }

    // Get locale from query params (default to Spanish)
    const url = new URL(request.url);
    const locale = (url.searchParams.get('locale') as Locale) || 'es';
    const dryRun = url.searchParams.get('dryRun') === 'true';

    // Override dry run via query param for testing
    if (dryRun) {
      process.env.SOCIAL_DRY_RUN = 'true';
    }

    console.log(`[Social Cron] Starting automated publish for locale: ${locale}`);
    console.log(`[Social Cron] Enabled platforms: ${enabledPlatforms.join(', ')}`);

    // Run the automated publish
    const { trek, results } = await runAutomatedPublish(locale);

    if (!trek) {
      return NextResponse.json({
        success: true,
        message: 'No treks available to publish (all have been published)',
        results: [],
      });
    }

    // Count successes and failures
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Published to ${successful} platform(s), ${failed} failed`,
      trek: {
        id: trek._id,
        title: trek.title[locale],
        slug: trek.slug,
      },
      results,
    });
  } catch (error) {
    console.error('[Social Cron] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: Request) {
  return GET(request);
}
