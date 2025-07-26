import toJsonSchema from 'joi-to-json';
import { readFileSync } from 'node:fs';
import { Task } from './Task.js';

import { compile } from 'handlebars';
import type { Config, ExtendedConfig } from './types.js';

/**
 * Create function-like Ollama task. The result function takes an object
 * of `InputType` and returns a Result promise with output of `OutputType`
 */
export const createTask = <
  InputType extends (undefined | Record<string, unknown>),
  OutputType = string,
>(config: Config) => {
  const extendedConfig: ExtendedConfig = {
    ...config,
    log: typeof config.log === 'boolean' ? config.log : true,
    jsonSchema: config.format ? toJsonSchema(config.format) : undefined,
    templates: config.templates.map((template) => ({
      role: template.role,
      content: compile(readFileSync(template.filename, 'utf-8').trim()),
    })),
  };
  return new Task<InputType, OutputType>(extendedConfig);
};
