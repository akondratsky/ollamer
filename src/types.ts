import type { Schema } from 'joi';
import type { JSONSchema } from 'json-schema-to-ts';
import type { ChatRequest } from 'ollama';

export type Config = {
  model: string;

  name: string;

  options: ChatRequest['options'];

  timeout: number;

  retries: number;

  tools?: ChatRequest['tools'];

  format?: Schema;

  log?: boolean;

  templates: {
    role: 'system' | 'user' | 'assistant';
    filename: string;
  }[];
};

type MessageTemplate = {
  role: 'system' | 'user' | 'assistant';
  content: HandlebarsTemplateDelegate;
};

export type ExtendedConfig = Omit<Config, 'templates'> & {
  jsonSchema?: Exclude<JSONSchema, boolean>;
  templates: MessageTemplate[];
  log: boolean;
};
