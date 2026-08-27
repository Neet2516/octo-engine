import type { Chunk } from './chunker'
import type { VectorEntry } from './retriever'

const BATCH_SIZE = 100

export async function embedText(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return new Array(1536).fill(0)

  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text.slice(0, 8000) }),
  })
  const data = await res.json()
  return data.data?.[0]?.embedding ?? new Array(1536).fill(0)
}

export async function embedChunks(chunks: Chunk[]): Promise<VectorEntry[]> {
  const entries: VectorEntry[] = []

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    const texts = batch.map((c) => c.text.slice(0, 8000))

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      // Fallback: random embeddings for dev
      entries.push(...batch.map((chunk) => ({ chunk, embedding: Array.from({ length: 1536 }, Math.random) })))
      continue
    }

    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: texts }),
    })
    const data = await res.json()
    const embeddings: number[][] = data.data?.map((d: { embedding: number[] }) => d.embedding) ?? []
    entries.push(...batch.map((chunk, j) => ({ chunk, embedding: embeddings[j] ?? new Array(1536).fill(0) })))
  }

  return entries
}
