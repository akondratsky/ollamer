import toJsonSchema from 'joi-to-json';
import { readFileSync } from 'node:fs';
import { Task } from './Task.js';

import { compile } from 'handlebars';
import type { Config, ExtendedConfig } from './types.js';

export const createTask = <
  InputType extends void | Record<string, unknown>,
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

export type { Result } from './Result.js';

export { colorize } from './colorize.js';
