import { Queue } from 'bullmq'
import IORedis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379'

let connection: IORedis | null = null
let analysisQueue: Queue | null = null

export function getRedis(): IORedis {
  if (!connection) {
    connection = new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) return null
        return Math.min(times * 200, 2000)
      },
    })
    connection.on('error', () => {
      // Handled gracefully when Redis is offline
    })
  }
  return connection
}

export function getAnalysisQueue(): Queue {
  if (!analysisQueue) {
    analysisQueue = new Queue('analysis', { connection: getRedis() })
  }
  return analysisQueue
}
