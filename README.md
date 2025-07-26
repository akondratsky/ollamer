# ollamer

## What is ~~love~~ ollamer?

Minimalistic wrapper for `ollama` for your experiments with building workflows locally.

Build your prompts with JSON output and use them as regular async functions.

## Usage example

Create folders with your prompts:

```
src
  tasks
    check_relevance
      index.ts
      article.hbs
  index.ts
```

Create ollama task.

```ts
// src/tasks/summarize/index.ts
import joi from 'joi';
import { resolve } from 'node:path';
import { createTask } from 'ollamer';

export type Input = {
  title: string;
  article: string;
};

export type Relevance = {
  related: boolean;
  confidence: number;
  reason: string;
};

export default createTask<Input, Relevance>({
  model: 'llama3.2',

  name: 'check_relevance',

  options: {
    // Ollama's options
    temperature: 0.1,
  },

  retries: 1,

  timeout: 30 * 1000,

  // Use `format` field to create JSON typing (it will be verified)
  format: joi.object<RelevanceResult>({
    related: joi.boolean()
      .required(),
    confidence: joi.number()
      .min(0)
      .max(1)
      .required(),
    reason: joi.string()
      .required(),
  }),

  templates: [
    {
      role: 'system',
      filename: resolve(import.meta.dir, './system.hbs'),
    },
    {
      role: 'user',
      filename: resolve(import.meta.dir, './article.hbs'),
    },
  ],
});
```

Use this task as it is usual asynchronous function:

```ts
// src/index.ts
import summarizeTask, type { Input, Relevance } from './tasks/summarize';
import type { Result } from 'ollamer';

const title = 'Using Ollama never was so convenient!';
const article = ` ... your articles are beautiful ... `;

const result: Result<Input, Relevance> = await summarizeTask.run({
  title,
  article,
});

console.log(result.output); // type defined with your Joi schema
```

That's it. Read package's JSDocs for more details.
