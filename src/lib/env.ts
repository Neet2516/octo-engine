import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  AI_PROVIDER: z.enum(['openai', 'anthropic']).default('openai'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

let _env: Env | null = null

export function getEnv(): Env {
  if (_env) return _env
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    console.error('[env] Invalid environment variables:', parsed.error.flatten())
    throw new Error('Invalid environment configuration. Check .env file.')
  }
  _env = parsed.data
  return _env
}

/** Validate that required keys for the AI provider are set */
export function validateAIEnv() {
  const env = getEnv()
  if (env.AI_PROVIDER === 'openai' && !env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required when AI_PROVIDER=openai')
  }
  if (env.AI_PROVIDER === 'anthropic' && !env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is required when AI_PROVIDER=anthropic')
  }
}
