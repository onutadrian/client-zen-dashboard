
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      await delay(delayMs * attempt);
    }
  }
  throw new Error('Max retries exceeded');
};
