export const cutOperationQSSchema = {
  type: 'object',
  required: ['u'],
  properties: {
    /**
     * Required URL
     */
    u: { type: 'string', format: 'uri', pattern: '^(http|https)://' },

    /**
     * Optional URL name
     */
    n: { type: 'string', maxLength: 100 },

    /**
     * Optional expires time in minutes
     */
    e: { type: 'number', minimum: 1, maximum: 1000_000 },
  },
} as const;
