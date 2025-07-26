/**
 * @private
 */
export const flattenOutput = (value: unknown) => {
  const result = {};
  flattenize(result, value, 'output');
  return result;
};

const flattenize = (object: Record<string, unknown>, value: unknown, prefix: string) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenize(object, item, `${prefix}_${index}`);
    });
  } else if (!value || typeof value !== 'object') {
    object[prefix] = value;
  } else {
    for (const [key, val] of Object.entries(value)) {
      flattenize(object, val, prefix ? `${prefix}_${key}` : key);
    }
  }
};
