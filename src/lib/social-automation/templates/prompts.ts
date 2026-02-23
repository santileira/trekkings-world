import type { TrekData, Locale } from '../types';

function buildTrekContext(trek: TrekData, locale: Locale): string {
  const title = trek.title[locale] || trek.title.es;
  const country = trek.country?.name[locale] || '';
  const region = trek.region?.name[locale] || '';

  const difficultyMap = {
    easy: locale === 'es' ? 'Fácil' : 'Easy',
    moderate: locale === 'es' ? 'Moderada' : 'Moderate',
    hard: locale === 'es' ? 'Difícil' : 'Hard',
    expert: locale === 'es' ? 'Experto' : 'Expert',
  };

  return `
Nombre: ${title}
Ubicación: ${region}, ${country}
Dificultad: ${difficultyMap[trek.difficulty] || trek.difficulty}
Duración: ${trek.duration || 'No especificada'}
Distancia: ${trek.distance ? `${trek.distance}km` : 'No especificada'}
Desnivel: ${trek.elevation ? `${trek.elevation}m` : 'No especificado'}
Mejor temporada: ${trek.bestSeason?.join(', ') || 'Todo el año'}
  `.trim();
}

export function getTweetPrompt(trek: TrekData, locale: Locale): string {
  const context = buildTrekContext(trek, locale);

  if (locale === 'es') {
    return `Genera un tweet atractivo sobre este trekking.

Datos del trek:
${context}

Requisitos:
- Máximo 250 caracteres (dejar espacio para link)
- Incluir 2-3 emojis relevantes (montaña, naturaleza, aventura)
- Crear emoción y curiosidad
- Idioma: Español
- NO incluir hashtags (se agregan por separado)
- Terminar con un llamado a la acción sutil

Devuelve SOLO el texto del tweet, nada más.`;
  }

  return `Generate an engaging tweet about this hiking trail.

Trek Data:
${context}

Requirements:
- Maximum 250 characters (leave room for link)
- Include 2-3 relevant emojis (mountain, nature, adventure)
- Create excitement and curiosity
- Language: English
- Do NOT include hashtags (added separately)
- End with a subtle call to action

Return ONLY the tweet text, nothing else.`;
}

export function getInstagramPrompt(trek: TrekData, locale: Locale): string {
  const context = buildTrekContext(trek, locale);

  if (locale === 'es') {
    return `Genera un caption de Instagram atractivo sobre este trekking.

Datos del trek:
${context}

Requisitos:
- Máximo 500 caracteres
- Empezar con una frase que capture la atención
- Incluir 3-4 emojis distribuidos en el texto
- Describir brevemente la experiencia
- Idioma: Español
- NO incluir hashtags (se agregan por separado)
- Terminar invitando a conocer más

Devuelve SOLO el caption, nada más.`;
  }

  return `Generate an engaging Instagram caption about this hiking trail.

Trek Data:
${context}

Requirements:
- Maximum 500 characters
- Start with an attention-grabbing phrase
- Include 3-4 emojis throughout the text
- Briefly describe the experience
- Language: English
- Do NOT include hashtags (added separately)
- End with an invitation to learn more

Return ONLY the caption, nothing else.`;
}

export function getBlueskyPrompt(trek: TrekData, locale: Locale): string {
  const context = buildTrekContext(trek, locale);

  if (locale === 'es') {
    return `Genera un post de Bluesky atractivo sobre este trekking.

Datos del trek:
${context}

Requisitos:
- Máximo 280 caracteres
- Incluir 2 emojis relevantes
- Tono conversacional y auténtico
- Idioma: Español
- NO incluir hashtags
- Invitar a descubrir más

Devuelve SOLO el texto del post, nada más.`;
  }

  return `Generate an engaging Bluesky post about this hiking trail.

Trek Data:
${context}

Requirements:
- Maximum 280 characters
- Include 2 relevant emojis
- Conversational and authentic tone
- Language: English
- Do NOT include hashtags
- Invite to discover more

Return ONLY the post text, nothing else.`;
}
