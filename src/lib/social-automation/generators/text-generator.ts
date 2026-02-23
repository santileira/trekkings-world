import type { TrekData, Platform, Locale, ContentGeneratorOptions } from '../types';
import { getTweetPrompt, getInstagramPrompt, getBlueskyPrompt } from '../templates/prompts';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
}

async function callClaudeAPI(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data: ClaudeResponse = await response.json();
  return data.content[0]?.text || '';
}

function getPromptForPlatform(
  trek: TrekData,
  platform: Platform,
  locale: Locale
): string {
  switch (platform) {
    case 'twitter':
      return getTweetPrompt(trek, locale);
    case 'instagram':
      return getInstagramPrompt(trek, locale);
    case 'bluesky':
      return getBlueskyPrompt(trek, locale);
    default:
      return getTweetPrompt(trek, locale);
  }
}

export async function generateText(
  options: ContentGeneratorOptions
): Promise<string> {
  const { trek, platform, locale } = options;

  try {
    const prompt = getPromptForPlatform(trek, platform, locale);
    const generatedText = await callClaudeAPI(prompt);

    // Clean up the response
    return generatedText.trim();
  } catch (error) {
    console.error('Error generating text:', error);

    // Fallback to template-based content
    return generateFallbackText(trek, platform, locale);
  }
}

function generateFallbackText(
  trek: TrekData,
  platform: Platform,
  locale: Locale
): string {
  const title = trek.title[locale] || trek.title.es || trek.title.en;
  const country = trek.country?.name[locale] || '';
  const region = trek.region?.name[locale] || '';

  const templates = {
    es: [
      `Descubrí ${title} en ${region}, ${country}. Una aventura que no te podés perder.`,
      `${title}: ${trek.distance || '?'}km de senderos increíbles en ${country}.`,
      `Explorá ${title}, uno de los trekkings más impresionantes de ${region}.`,
    ],
    en: [
      `Discover ${title} in ${region}, ${country}. An adventure you can't miss.`,
      `${title}: ${trek.distance || '?'}km of incredible trails in ${country}.`,
      `Explore ${title}, one of the most impressive treks in ${region}.`,
    ],
  };

  const localeTemplates = templates[locale] || templates.es;
  const randomIndex = Math.floor(Math.random() * localeTemplates.length);

  return localeTemplates[randomIndex];
}
