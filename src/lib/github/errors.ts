export class InvalidUrlError extends Error {
  constructor(message = 'Invalid GitHub repository URL') {
    super(message)
    this.name = 'InvalidUrlError'
  }
}

export class RepoNotFoundError extends Error {
  constructor(message = 'Repository not found or does not exist') {
    super(message)
    this.name = 'RepoNotFoundError'
  }
}

export class PrivateRepoError extends Error {
  constructor(message = 'Repository is private. Only public repositories are supported.') {
    super(message)
    this.name = 'PrivateRepoError'
  }
}

export class RateLimitError extends Error {
  resetAt: Date
  constructor(resetAt: Date, message = 'GitHub API rate limit exceeded') {
    super(message)
    this.name = 'RateLimitError'
    this.resetAt = resetAt
  }
}

export class RepoTooLargeError extends Error {
  fileCount: number
  constructor(fileCount: number, message = 'Repository is too large to analyse') {
    super(message)
    this.name = 'RepoTooLargeError'
    this.fileCount = fileCount
  }
}
