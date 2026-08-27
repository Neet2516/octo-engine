import type { RepoFile } from '@/types/repository'
import type { RepositoryAnalysis } from '@/types/analysis'

interface SecuritySignal {
  pattern: RegExp
  mechanism: string
  description: string
}

const SECURITY_SIGNALS: SecuritySignal[] = [
  { pattern: /jsonwebtoken|jwt\.sign|jwt\.verify/i, mechanism: 'JWT', description: 'JSON Web Token authentication' },
  { pattern: /bcrypt|argon2|scrypt/i, mechanism: 'Password Hashing', description: 'Secure password hashing' },
  { pattern: /passport|passport-jwt|passport-local/i, mechanism: 'Passport.js', description: 'Passport.js authentication middleware' },
  { pattern: /cors\s*\(/i, mechanism: 'CORS', description: 'Cross-Origin Resource Sharing policy' },
  { pattern: /helmet\s*\(/i, mechanism: 'Helmet.js', description: 'HTTP security headers via Helmet' },
  { pattern: /rateLimit|rate-limit|@upstash\/ratelimit/i, mechanism: 'Rate Limiting', description: 'API rate limiting protection' },
  { pattern: /express-validator|zod\.parse|z\.object/i, mechanism: 'Input Validation', description: 'Input validation and sanitisation' },
  { pattern: /next-auth|@auth\/nextjs/i, mechanism: 'NextAuth.js', description: 'Next.js authentication via NextAuth' },
  { pattern: /oauth|OAuth2/i, mechanism: 'OAuth', description: 'OAuth 2.0 authorisation flow' },
  { pattern: /RBAC|role.*based|hasRole|checkRole/i, mechanism: 'RBAC', description: 'Role-based access control' },
  { pattern: /DOMPurify|sanitize-html|xss/i, mechanism: 'XSS Protection', description: 'HTML/content sanitisation' },
  { pattern: /csrf|csurf/i, mechanism: 'CSRF Protection', description: 'Cross-Site Request Forgery protection' },
  { pattern: /process\.env\.[A-Z_]+/i, mechanism: 'Environment Variables', description: 'Secrets managed via environment variables' },
]

export function detectSecurity(files: RepoFile[]): RepositoryAnalysis['security'] {
  const results: RepositoryAnalysis['security'] = []
  const foundMechanisms = new Set<string>()

  for (const signal of SECURITY_SIGNALS) {
    const evidenceFiles: string[] = []

    for (const file of files) {
      if (!file.content || !file.isRelevant) continue
      if (signal.pattern.test(file.content)) {
        evidenceFiles.push(file.path)
      }
    }

    if (evidenceFiles.length > 0 && !foundMechanisms.has(signal.mechanism)) {
      foundMechanisms.add(signal.mechanism)
      results.push({
        mechanism: signal.mechanism,
        description: signal.description,
        evidence: evidenceFiles.slice(0, 3),
      })
    }
  }

  return results
}
