import { z, ZodSchema } from 'zod'

export interface AIProvider {
  complete(prompt: string, schema?: ZodSchema): Promise<unknown>
  streamComplete(prompt: string): AsyncIterable<string>
}

// ── OpenAI Provider ──────────────────────────────────────────────────────────

export class OpenAIProvider implements AIProvider {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model = 'gpt-4o') {
    this.apiKey = apiKey
    this.model = model
  }

  async complete(prompt: string, schema?: ZodSchema): Promise<unknown> {
    const body: Record<string, unknown> = {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }

    if (schema) {
      body.response_format = { type: 'json_object' }
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`OpenAI error: ${res.status} ${await res.text()}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? ''

    if (schema) {
      try {
        return schema.parse(JSON.parse(content))
      } catch {
        return JSON.parse(content)
      }
    }
    return content
  }

  async *streamComplete(prompt: string): AsyncIterable<string> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    })

    if (!res.body) return
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      for (const line of chunk.split('\n')) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          try {
            const parsed = JSON.parse(line.slice(6))
            const text = parsed.choices?.[0]?.delta?.content
            if (text) yield text
          } catch { /* skip malformed lines */ }
        }
      }
    }
  }
}

// ── Anthropic Provider ───────────────────────────────────────────────────────

export class AnthropicProvider implements AIProvider {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model = 'claude-3-5-sonnet-20241022') {
    this.apiKey = apiKey
    this.model = model
  }

  async complete(prompt: string, _schema?: ZodSchema): Promise<unknown> {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) throw new Error(`Anthropic error: ${res.status} ${await res.text()}`)
    const data = await res.json()
    return data.content?.[0]?.text ?? ''
  }

  async *streamComplete(prompt: string): AsyncIterable<string> {
    // Simplified — just complete and yield the whole response
    const result = await this.complete(prompt)
    yield String(result)
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? 'openai'
  if (provider === 'anthropic') {
    const key = process.env.ANTHROPIC_API_KEY
    if (!key) throw new Error('ANTHROPIC_API_KEY is not set')
    return new AnthropicProvider(key)
  }
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not set')
  return new OpenAIProvider(key)
}
