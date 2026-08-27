// Chunk file content into overlapping token windows
const CHUNK_SIZE = 512   // tokens (approx chars / 4)
const OVERLAP = 50

export interface Chunk {
  filePath: string
  language: string
  score: number
  text: string
  index: number
}

export function chunkFile(
  content: string,
  filePath: string,
  language: string,
  score: number
): Chunk[] {
  const charSize = CHUNK_SIZE * 4
  const charOverlap = OVERLAP * 4
  const chunks: Chunk[] = []

  let start = 0
  let index = 0
  while (start < content.length) {
    const end = Math.min(start + charSize, content.length)
    chunks.push({ filePath, language, score, text: content.slice(start, end), index })
    start += charSize - charOverlap
    index++
    if (end === content.length) break
  }
  return chunks
}

export function chunkFiles(
  files: { path: string; language: string; content?: string; isRelevant: boolean }[],
  scoreMap: Record<string, number>
): Chunk[] {
  const all: Chunk[] = []
  for (const file of files) {
    if (!file.isRelevant || !file.content) continue
    const score = scoreMap[file.path] ?? 50
    all.push(...chunkFile(file.content, file.path, file.language, score))
  }
  return all
}
