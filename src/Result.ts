import type { ChatRequest, ChatResponse } from 'ollama';
import { flattenOutput } from './flattenOutput';

export class Result<InputType = void, OutputType = string> {
  public readonly response: ChatResponse | null;
  public readonly error: string | null;
  public readonly isValidJson: boolean | null = null;
  public readonly success: boolean = true;
  public readonly input: InputType;
  public readonly output: OutputType | null;
  public readonly request: ChatRequest;
  public readonly attempts: number;
  public readonly duration: number;
  public readonly taskName: string;

  constructor(result: {
    response: ChatResponse | null;
    error: Error | string | null;
    isValidJson: boolean | null;
    success: boolean;
    input: InputType;
    output: OutputType | null;
    request: ChatRequest;
    attempts: number;
    startTime: number;
    taskName: string;
  }) {
    this.duration = Date.now() - result.startTime;
    this.response = result.response;
    this.error = result.error instanceof Error
      ? result.error.message
      : result.error;
    this.isValidJson = result.isValidJson;
    this.success = result.success;
    this.input = result.input;
    this.output = result.output;
    this.request = result.request;
    this.attempts = result.attempts;
    this.taskName = result.taskName;
  }

  public getRawInput(): string {
    return this.request.messages
      ?.map(({ content, role }) => `[${role}]:\n${content}`)
      .join('\n\n') ?? '';
  }

  public getRawOutput(): string {
    return this.response?.message.content ?? '';
  }

  public getPlainOutput(): Record<string, unknown> {
    return flattenOutput(this.output);
  }
}
