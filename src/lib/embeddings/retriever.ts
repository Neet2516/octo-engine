import type { Chunk } from './chunker'

export interface VectorEntry {
  chunk: Chunk
  embedding: number[]
}

export type VectorStore = VectorEntry[]

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-8)
}

export async function retrieveRelevant(
  query: string,
  store: VectorStore,
  topK = 20
): Promise<Chunk[]> {
  const { embedText } = await import('./embedder')
  const queryEmbedding = await embedText(query)

  const scored = store.map((entry) => ({
    chunk: entry.chunk,
    score: cosineSimilarity(queryEmbedding, entry.embedding),
  }))

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.chunk)
}
