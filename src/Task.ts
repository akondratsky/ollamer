import type { ChatResponse } from 'ollama';
import { JsonValidator } from './JsonValidator';
import { OllamaClient } from './OllamaClient';
import { Result } from './Result';
import type { ExtendedConfig } from './types';

export class Task<
  InputType = void,
  OutputType = string,
> {
  private readonly jsonValidator: JsonValidator | null = null;

  constructor(private readonly config: ExtendedConfig) {
    if (config.format) {
      this.jsonValidator = new JsonValidator(config.format);
    }
  }

  public async run(input: InputType): Promise<Result<InputType, OutputType>> {
    const startTime = Date.now();
    let response: ChatResponse | null = null;
    let error: Error | null = null;
    let output: OutputType | null = null;
    let isValidJson: boolean | null = null;
    let success = true;
    let attempts = 0;
    const request = {
      model: this.config.model,
      options: this.config.options,
      tools: this.config.tools,
      format: this.config.jsonSchema,
      messages: this.config.templates.map(({ content, role }) => ({
        role,
        content: content(input),
      })),
    };

    const result = await new OllamaClient().chat({
      request,
      log: this.config.log,
      retries: this.config.retries,
      timeout: this.config.timeout,
    });
    response = result.response;
    attempts = result.attempts;
    error = result.error;
    success = !result.error;

    if (response) {
      if (this.jsonValidator) {
        const validation = this.jsonValidator.validate(response.message.content);
        error = validation.error ?? null;
        output = validation.value as OutputType ?? null;
        isValidJson = !validation.error;
        success = !validation.error;
      } else {
        output = response.message.content as OutputType;
      }
    }

    return new Result<InputType, OutputType>({
      taskName: this.config.name,
      request,
      response,
      error,
      input,
      output,
      isValidJson,
      success,
      attempts,
      startTime,
    });
  }
}
