export type ArtifactType =
  | 'BUILD_LOG'
  | 'SYSTEM_OBSERVATION'
  | 'PROJECT_EXPLAINER'
  | 'TEACHING_MOMENT'
  | 'PROGRESS_SNAPSHOT'
  | 'RAW_COMMIT'

export type ArtifactSource = 'git' | 'manual' | 'ci/cd' | 'api' | 'screenshot'

export interface Artifact {
  id: string
  slug: string
  createdAt: string
  source: ArtifactSource
  type: ArtifactType
  metadata: {
    title: string
    summary: string
    authorId?: string
    tags: string[]
    sourceRef: string
  }
  payload: Record<string, unknown>
}

export interface PublishedFile {
  id: string
  type: string
  filename: string
  content: string
}