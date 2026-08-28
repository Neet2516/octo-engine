import { analyseRepository } from '@/services/repository.service'
import { runStaticAnalysis } from '@/lib/analyzer'
import { runAIPipeline } from '@/lib/ai/pipeline'
import { generateReportSections } from '@/lib/ai/report-generator'
import { createReport, setSections } from '@/services/report.service'

export interface JobState {
  jobId: string
  repositoryId: string
  reportId: string
  status: 'queued' | 'active' | 'completed' | 'failed'
  progress: number
  currentStep: string
  error: string | null
}

declare global {
  // eslint-disable-next-line no-var
  var _octoJobs: Map<string, JobState> | undefined
}

const jobs: Map<string, JobState> = globalThis._octoJobs ?? (globalThis._octoJobs = new Map<string, JobState>())

export function getJob(jobId: string): JobState | null {
  return jobs.get(jobId) ?? null
}

export async function startDirectAnalysis(
  url: string,
  jobId: string,
  repositoryId: string,
  reportId: string
): Promise<void> {
  const job: JobState = {
    jobId,
    repositoryId,
    reportId,
    status: 'active',
    progress: 5,
    currentStep: 'Validating repository and fetching structure',
    error: null,
  }
  jobs.set(jobId, job)

  // Initialize report in pending state
  await createReport(repositoryId, url.split('/').pop() || 'Project Report', reportId)

  // Run pipeline asynchronously
  ;(async () => {
    try {
      // Step 1: Fetch metadata & files
      job.progress = 15
      job.currentStep = 'Fetching repository files and metadata'
      const { meta, files } = await analyseRepository(url)

      // Step 2: Static Analysis
      job.progress = 35
      job.currentStep = 'Running static code & architecture analysis'
      const staticAnalysis = await runStaticAnalysis(files)

      // Step 3: AI Enrichment Pipeline
      job.progress = 60
      job.currentStep = 'Synthesizing architecture & implementation with AI'
      const excerpts = files
        .filter((f) => f.isRelevant && f.content)
        .slice(0, 25)
        .map((f) => `// ${f.path}\n${f.content!.slice(0, 600)}`)

      const fullAnalysis = await runAIPipeline(meta, staticAnalysis, excerpts)

      // Step 4: Report Generation
      job.progress = 85
      job.currentStep = 'Generating 27 academic report sections'
      const sections = await generateReportSections(fullAnalysis)

      // Step 5: Complete
      await setSections(reportId, sections)
      job.progress = 100
      job.currentStep = 'Complete'
      job.status = 'completed'
    } catch (err: unknown) {
      console.error('[Analysis Service Error]:', err)
      job.status = 'failed'
      job.error = err instanceof Error ? err.message : 'Unknown analysis error'
    }
  })()
}

