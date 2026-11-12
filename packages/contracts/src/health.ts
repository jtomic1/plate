import { z } from 'zod';

export const HealthStatus = z.object({
  status: z.enum(['ok', 'degraded', 'down']),
  database: z.enum(['up', 'down']),
});

export type HealthStatus = z.infer<typeof HealthStatus>;
