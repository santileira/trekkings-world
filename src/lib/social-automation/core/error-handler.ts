import type { Platform } from '../types';

export class SocialAutomationError extends Error {
  constructor(
    message: string,
    public platform: Platform | 'system',
    public isRetryable: boolean = false,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'SocialAutomationError';
  }
}

export function handleError(
  error: unknown,
  platform: Platform | 'system',
  context?: string
): SocialAutomationError {
  const contextPrefix = context ? `[${context}] ` : '';

  if (error instanceof SocialAutomationError) {
    return error;
  }

  if (error instanceof Error) {
    // Check for retryable errors
    const isRetryable = isRetryableError(error);

    return new SocialAutomationError(
      `${contextPrefix}${error.message}`,
      platform,
      isRetryable,
      error
    );
  }

  return new SocialAutomationError(
    `${contextPrefix}Unknown error occurred`,
    platform,
    false
  );
}

function isRetryableError(error: Error): boolean {
  const retryablePatterns = [
    /rate limit/i,
    /timeout/i,
    /network/i,
    /temporarily unavailable/i,
    /503/,
    /502/,
    /429/,
  ];

  return retryablePatterns.some((pattern) => pattern.test(error.message));
}

export function logError(error: SocialAutomationError): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    platform: error.platform,
    message: error.message,
    isRetryable: error.isRetryable,
    stack: error.stack,
  };

  console.error('[Social Automation Error]', JSON.stringify(logEntry, null, 2));
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  platform: Platform | 'system',
  context?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const handledError = handleError(error, platform, context);
    logError(handledError);
    throw handledError;
  }
}
