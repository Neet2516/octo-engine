# T12 · Large Repository RAG Strategy

**Commit:** `feat: add chunking, embeddings, and vector retrieval for large repositories`

**Depends on:** T05

---

## Objective
Repositories with > 500 relevant files should not be sent wholesale to the LLM. Use embedding-based retrieval to select the most relevant chunks per AI task.

## Threshold
If `relevantFiles.length > 500` → engage RAG mode.

## Files

### `src/lib/embeddings/chunker.ts`
- Split each file content into chunks of max 512 tokens (overlap 50 tokens).
- Attach metadata: `{ filePath, language, score }`.

### `src/lib/embeddings/embedder.ts`
- Use OpenAI `text-embedding-3-small` or local `@xenova/transformers` (fallback).
- Batch embed all chunks (max 100 per request).

### `src/lib/embeddings/store.ts`
- In-memory vector store (flat cosine similarity) for single analysis sessions.
- Persist to DB as JSON blob for caching (keyed by `commitSha`).

### `src/lib/embeddings/retriever.ts`
```ts
export async function retrieveRelevant(
  query: string,
  store: VectorStore,
  topK: number = 20
): Promise<Chunk[]>
```

### `src/lib/analyzer/index.ts` (update)
Before AI pipeline:
- If RAG mode, embed all chunks.
- For each AI task prompt, call `retrieveRelevant(taskQuery, store)`.
- Pass top-K chunks as `relevantExcerpts`.

## Done-Definition
A 2000-file repo completes analysis without hitting LLM context window; retrieved chunks are relevant (manual check on 5 queries).
