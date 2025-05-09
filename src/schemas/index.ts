export const cutOperationQSSchema = {
  type: 'object',
  required: ['u'],
  properties: {
    u: { type: 'string', format: 'uri', pattern: '^(http|https)://' },
    n: { type: 'string', maxLength: 100 },
    e: { type: 'number', minimum: 1 },
  },
} as const;
