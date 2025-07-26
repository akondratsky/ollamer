import { type ChatRequest, type ChatResponse, Ollama } from 'ollama';
import { colorize } from './colorize';

type ChatParams = {
  request: ChatRequest;
  timeout?: number;
  log?: boolean;
  retries: number;
};

type Result = {
  response: ChatResponse | null;
  attempts: number;
  error: Error | null;
};

class TimeoutError extends Error {}

export class OllamaClient {
  /**
   * Request with a timeout
   * @returns
   */
  public async chat(chatParams: ChatParams): Promise<Result> {
    let allowedAttempts = chatParams.retries + 1;
    let response: ChatResponse | null = null;
    let error: Error | null = null;
    let attempts = 1;
    const ollama = new Ollama({});

    while (attempts <= allowedAttempts && !response) {
      try {
        response = await this.request(ollama, chatParams);
        response.message.content = response.message.content.trim();
        return {
          response,
          attempts,
          error: null,
        };
      } catch (err) {
        if (err instanceof TimeoutError && attempts < allowedAttempts) {
          attempts++;
          continue;
        }
        error = err as Error;
        break;
      }
    }

    return {
      response: null,
      attempts,
      error,
    };
  }

  private async request(ollama: Ollama, {
    request,
    timeout = 30 * 1000, // 30 seconds
    log = true,
  }: ChatParams) {
    const controller = new AbortController();

    let timeoutId: ReturnType<typeof setTimeout>;

    const promiseTimeout = () =>
      new Promise<ChatResponse>((_, reject) => {
        timeoutId = setTimeout(() => {
          controller.abort();
          ollama.abort();
          reject(new TimeoutError('Ollama chat request timed out'));
        }, timeout); // 2 minutes timeout
      });

    const promiseResponse = async () => {
      const result = await ollama.chat({
        ...request,
        stream: true,
      });

      let response: ChatResponse | null = null;

      for await (const chunk of result) {
        if (controller.signal.aborted) {
          throw new TimeoutError('Ollama chat request aborted');
        }
        if (log) {
          log && process.stdout.write(colorize.gray(chunk.message.content));
        }
        if (!response) {
          // clone is just for the sake of safety and to save all the fields from the response
          response = structuredClone(chunk);
          continue;
        }
        response.message.content += chunk.message.content;
      }
      if (log) {
        process.stdout.write(colorize.gray('\n'));
      }

      clearTimeout(timeoutId);

      return response as ChatResponse;
    };

    return Promise.race([
      promiseResponse(),
      promiseTimeout(),
    ]);
  }
}
