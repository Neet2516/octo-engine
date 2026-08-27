import { Octokit } from '@octokit/rest'

let instance: Octokit | null = null

export function getOctokit(): Octokit {
  if (!instance) {
    instance = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      userAgent: 'octo-engine/1.0',
    })
  }
  return instance
}
