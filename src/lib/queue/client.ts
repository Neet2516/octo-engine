import { Queue } from 'bullmq'
import IORedis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379'

let connection: IORedis | null = null
let analysisQueue: Queue | null = null

export function getRedis(): IORedis {
  if (!connection) {
    connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null })
  }
  return connection
}

export function getAnalysisQueue(): Queue {
  if (!analysisQueue) {
    analysisQueue = new Queue('analysis', { connection: getRedis() })
  }
  return analysisQueue
}
