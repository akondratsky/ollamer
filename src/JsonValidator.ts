import type { Schema } from 'joi';

export class JsonValidator {
  constructor(private readonly schema: Schema) {
  }

  public validate(value: string) {
    if (!this.isValidJson(value)) {
      return { value, error: new Error('Invalid JSON format') };
    }
    return this.schema.validate(this.parseJson(value));
  }

  private parseJson(json: string) {
    const parsed = JSON.parse(json);
    return Object.entries(parsed).reduce((acc, [key, value]) => {
      acc[key.toLowerCase()] = value;
      return acc;
    }, {} as Record<string, unknown>);
  }

  // #region private
  private isValidJson(json: string): boolean {
    try {
      JSON.parse(json);
      return true;
    } catch (error) {
      return false;
    }
  }
}
