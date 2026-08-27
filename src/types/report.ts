export type SectionType =
  | 'cover'
  | 'certificate'
  | 'declaration'
  | 'acknowledgement'
  | 'abstract'
  | 'toc'
  | 'introduction'
  | 'problem_statement'
  | 'objectives'
  | 'existing_system'
  | 'proposed_system'
  | 'scope'
  | 'tech_stack'
  | 'system_requirements'
  | 'architecture'
  | 'system_design'
  | 'modules'
  | 'database'
  | 'api'
  | 'implementation'
  | 'security'
  | 'testing'
  | 'results'
  | 'limitations'
  | 'future_scope'
  | 'conclusion'
  | 'references'

export interface ReportSection {
  id: string
  type: SectionType
  title: string
  content: string
  version: number
  updatedAt: Date
}

export interface Report {
  id: string
  repositoryId: string
  title: string
  status: 'pending' | 'generating' | 'ready' | 'error'
  version: number
  sections: ReportSection[]
  metadataJson?: ReportMetadata
  createdAt: Date
  updatedAt: Date
}

export interface ReportMetadata {
  studentNames?: string[]
  college?: string
  guide?: string
  academicYear?: string
}

export const SECTION_TITLES: Record<SectionType, string> = {
  cover: 'Cover Page',
  certificate: 'Certificate',
  declaration: 'Declaration',
  acknowledgement: 'Acknowledgement',
  abstract: 'Abstract',
  toc: 'Table of Contents',
  introduction: 'Introduction',
  problem_statement: 'Problem Statement',
  objectives: 'Objectives',
  existing_system: 'Existing System',
  proposed_system: 'Proposed System',
  scope: 'Scope of the Project',
  tech_stack: 'Technology Stack',
  system_requirements: 'System Requirements',
  architecture: 'System Architecture',
  system_design: 'System Design',
  modules: 'Module Description',
  database: 'Database Design',
  api: 'API Design',
  implementation: 'Implementation Details',
  security: 'Security Considerations',
  testing: 'Testing & Quality Assurance',
  results: 'Results',
  limitations: 'Limitations',
  future_scope: 'Future Scope',
  conclusion: 'Conclusion',
  references: 'References',
}

export const ALL_SECTION_TYPES: SectionType[] = Object.keys(SECTION_TITLES) as SectionType[]
