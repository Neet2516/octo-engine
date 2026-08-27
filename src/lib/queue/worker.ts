import { Worker } from 'bullmq'
import { getRedis } from './client'
import { analyseRepository } from '@/services/repository.service'
import { runStaticAnalysis } from '@/lib/analyzer'
import { runAIPipeline } from '@/lib/ai/pipeline'
import { generateReportSections } from '@/lib/ai/report-generator'

interface JobData {
  url: string
  repositoryId: string
  reportId: string
}

type StepUpdater = (progress: number, step: string) => Promise<void>

export function startWorker() {
  const worker = new Worker<JobData>(
    'analysis',
    async (job) => {
      const { url, repositoryId } = job.data
      const update: StepUpdater = async (progress, step) => {
        await job.updateProgress(progress)
        await job.updateData({ ...job.data, currentStep: step })
      }

      // Step 1 (10%): Validate URL + fetch metadata
      await update(10, 'Validating repository URL')
      const { meta, files } = await analyseRepository(url)

      // Step 2 (20%): Already done above (meta fetched)
      await update(20, 'Fetching repository metadata')

      // Step 3 (35%): Static analysis
      await update(35, 'Analysing file structure and dependencies')
      const staticAnalysis = await runStaticAnalysis(files)

      // Step 4 (50%): File content already fetched; mark step
      await update(50, 'Analysing source code')

      // Step 5 (70%): AI pipeline (tasks 01-07)
      await update(70, 'Running AI analysis pipeline')
      const excerpts = files
        .filter((f) => f.isRelevant && f.content)
        .slice(0, 20)
        .map((f) => `// ${f.path}\n${f.content!.slice(0, 500)}`)

      const fullAnalysis = await runAIPipeline(meta, staticAnalysis, excerpts)

      // Step 6 (90%): Generate report sections
      await update(90, 'Generating report sections')
      const sections = await generateReportSections(fullAnalysis)

      // Step 7 (100%): Complete
      await update(100, 'Complete')

      return { repositoryId, sections: sections.length }
    },
    { connection: getRedis(), concurrency: 2 }
  )

  worker.on('failed', (job, err) => {
    console.error(`[worker] Job ${job?.id} failed:`, err.message)
  })

  return worker
}
