import { useState, useEffect } from 'react'
import { ArtifactList } from './components/ArtifactList'
import { MetricsOverview } from './components/MetricsOverview'
import { ArtifactViewer } from './components/ArtifactViewer'
import { Logo } from './components/Logo'
import type { Artifact, PublishedFile } from './types'

function App() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [publishedFiles, setPublishedFiles] = useState<PublishedFile[]>([])
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArtifacts()
  }, [])

  async function loadArtifacts() {
    try {
      const response = await fetch('/api/artifacts')
      
      if (!response.ok) {
        const mockArtifacts = generateMockArtifacts()
        setArtifacts(mockArtifacts)
        setPublishedFiles(generateMockPublishedFiles(mockArtifacts))
      } else {
        const data = await response.json()
        setArtifacts(data.artifacts)
        setPublishedFiles(data.published)
      }
    } catch (error) {
      console.error('Failed to load artifacts:', error)
      const mockArtifacts = generateMockArtifacts()
      setArtifacts(mockArtifacts)
      setPublishedFiles(generateMockPublishedFiles(mockArtifacts))
    } finally {
      setLoading(false)
    }
  }

  const filteredArtifacts = filter === 'all' 
    ? artifacts 
    : artifacts.filter(a => a.type === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading artifacts...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo />
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900">CONTENT FACTOR</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Proof-of-work visibility dashboard
                </p>
              </div>
            </div>
            <button 
              onClick={loadArtifacts}
              className="px-4 py-2 bg-build text-white rounded-md hover:opacity-90 transition-opacity font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Metrics */}
          <MetricsOverview artifacts={artifacts} publishedFiles={publishedFiles} />

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-build text-white'
                  : 'bg-surface text-gray-700 hover:bg-gray-50 border border-border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('RAW_COMMIT')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'RAW_COMMIT'
                  ? 'bg-capture text-white'
                  : 'bg-surface text-gray-700 hover:bg-gray-50 border border-border'
              }`}
            >
              Commits
            </button>
            <button
              onClick={() => setFilter('PROGRESS_SNAPSHOT')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'PROGRESS_SNAPSHOT'
                  ? 'bg-measure text-white'
                  : 'bg-surface text-gray-700 hover:bg-gray-50 border border-border'
              }`}
            >
              Retros
            </button>
          </div>

          {/* Artifact List and Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ArtifactList 
              artifacts={filteredArtifacts}
              selectedId={selectedArtifact}
              onSelect={setSelectedArtifact}
            />
            <ArtifactViewer 
              artifactId={selectedArtifact}
              publishedFiles={publishedFiles}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

// Mock data generators
function generateMockArtifacts(): Artifact[] {
  return [
    {
      id: 'raw-commit-20251025-0kuf',
      slug: 'feat-pipeline-initial-test',
      createdAt: '2025-10-25T14:30:00Z',
      source: 'git',
      type: 'RAW_COMMIT',
      metadata: {
        title: 'feat(pipeline): initial test successful',
        summary: 'feat(pipeline): initial test successful — pipeline verified end-to-end',
        tags: ['git', 'raw-commit'],
        sourceRef: '5a6b5cd08e0ab86d051f355cc1ce720bf034fbf2'
      },
      payload: {}
    },
    {
      id: 'progress-snapshot-20251025-7cpt',
      slug: 'sprint-0-content-factor-pipeline',
      createdAt: '2025-10-25T16:45:00Z',
      source: 'manual',
      type: 'PROGRESS_SNAPSHOT',
      metadata: {
        title: 'Sprint 0: Content Factor Pipeline',
        summary: 'Built full pipeline with multi-capture support',
        tags: ['retro', 'sprint', 'retrospective'],
        sourceRef: 'retro-2025-10-25'
      },
      payload: {
        whatShipped: 'Built full pipeline with multi-capture support',
        whatWentWell: 'The system is now extensible',
        whatWasHard: 'Tempering excitement',
        whatLearned: 'This is something we can do, just fine, it seems'
      }
    }
  ]
}

function generateMockPublishedFiles(artifacts: Artifact[]): PublishedFile[] {
  return artifacts.map(a => ({
    id: a.id,
    type: a.type === 'RAW_COMMIT' ? 'BuildLog' : 'ProgressSnapshot',
    filename: `${a.id}-${a.type === 'RAW_COMMIT' ? 'BuildLog' : 'ProgressSnapshot'}.md`,
    content: generateMockMarkdown(a)
  }))
}

function generateMockMarkdown(artifact: Artifact): string {
  if (artifact.type === 'RAW_COMMIT') {
    return `# Build Log

*Artifact ID: \`${artifact.id}\`*

---

## What I Built
${artifact.metadata.summary}

## Why It Matters
TBD – connect this to the problem it solves

## What I Learned
TBD – note any insights or patterns

## Next Step
TBD – define the next action

---

**Recommended Channels:** twitter, linkedin, dev-blog`
  } else {
    const payload = artifact.payload as any
    return `# Progress Snapshot

*Artifact ID: \`${artifact.id}\`*

---

## ${artifact.metadata.title}

## What I Shipped
${payload.whatShipped || 'N/A'}

## What Went Well
${payload.whatWentWell || 'N/A'}

## What Was Hard
${payload.whatWasHard || 'N/A'}

## What I Learned
${payload.whatLearned || 'N/A'}

## Next Focus
${payload.nextFocus || 'TBD'}

---

**Recommended Channels:** newsletter, linkedin-update, community-post`
  }
}

export default App