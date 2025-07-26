import type { ChatRequest, ChatResponse } from 'ollama';
import { flattenOutput } from './flattenOutput';

/**
 * Result of Ollama task execution
 */
export class Result<InputType = void, OutputType = string> {
  /** Response from the Ollama API */
  public readonly response: ChatResponse | null;

  /** Error message if the task failed */
  public readonly error: string | null;

  /** Whether the output is valid JSON */
  public readonly isValidJson: boolean | null = null;

  /** Whether the task was successful */
  public readonly success: boolean = true;

  /** Input data for the task */
  public readonly input: InputType;

  /** Output data from the task, null if error */
  public readonly output: OutputType | null;

  /** Original request sent to the Ollama API */
  public readonly request: ChatRequest;

  /** Number of attempts made to execute the task */
  public readonly attempts: number;

  /** Duration of the task execution in milliseconds */
  public readonly duration: number;

  /** Name of the task */
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

  /** Returns raw input messages, formatted as a string. */
  public getRawInput(): string {
    return this.request.messages
      ?.map(({ content, role }) => `[${role}]:\n${content}`)
      .join('\n\n') ?? '';
  }

  /** Returns raw unformatted message as a string */
  public getRawOutput(): string {
    return this.response?.message.content ?? '';
  }

  /** Returns output as a flattened object (without nesting) */
  public getPlainOutput(): Record<string, unknown> {
    return flattenOutput(this.output);
  }
}
