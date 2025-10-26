import type { PublishedFile } from '../types'

interface ArtifactViewerProps {
  artifactId: string | null
  publishedFiles: PublishedFile[]
}

export function ArtifactViewer({ artifactId, publishedFiles }: ArtifactViewerProps) {
  if (!artifactId) {
    return (
      <div className="bg-surface rounded-lg border border-border p-8 text-center sticky top-8">
        <div className="text-gray-400 text-5xl mb-4">📄</div>
        <p className="text-gray-500">Select an artifact to view its content</p>
      </div>
    )
  }

  const publishedFile = publishedFiles.find(f => f.id === artifactId)

  if (!publishedFile) {
    return (
      <div className="bg-surface rounded-lg border border-border p-8 text-center sticky top-8">
        <p className="text-gray-500">No published content found for this artifact</p>
      </div>
    )
  }

  const typeColors: Record<string, string> = {
    BuildLog: 'bg-capture/10 text-capture',
    ProgressSnapshot: 'bg-measure/10 text-measure',
    ProjectExplainer: 'bg-build/10 text-build',
    SystemObservation: 'bg-publish/10 text-publish',
    TeachingMoment: 'bg-transform/10 text-transform',
  }

  return (
    <div className="bg-surface rounded-lg border border-border sticky top-8 shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-gray-900">Published Content</h2>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${typeColors[publishedFile.type] || 'bg-gray-100 text-gray-600'}`}>
            {publishedFile.type}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1 font-mono">{publishedFile.filename}</p>
      </div>
      <div className="p-6 max-h-[600px] overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          <MarkdownRenderer content={publishedFile.content} />
        </div>
      </div>
    </div>
  )
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  
  return (
    <div className="space-y-4">
      {lines.map((line, idx) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-2xl font-heading font-bold text-gray-900 mt-6">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-xl font-heading font-semibold text-gray-800 mt-5">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-lg font-heading font-medium text-gray-700 mt-4">{line.slice(4)}</h3>
        }
        
        // Horizontal rules
        if (line.trim() === '---') {
          return <hr key={idx} className="my-6 border-border" />
        }
        
        // Italic text (asterisks)
        if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
          return <p key={idx} className="text-gray-600 italic">{line.slice(1, -1)}</p>
        }
        
        // Bold text
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={idx} className="text-gray-900 font-semibold">{line.slice(2, -2)}</p>
        }
        
        // Code blocks (inline code with backticks)
        if (line.includes('`')) {
          const parts = line.split('`')
          return (
            <p key={idx} className="text-gray-700">
              {parts.map((part, i) => 
                i % 2 === 0 ? part : <code key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-build">{part}</code>
              )}
            </p>
          )
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <div key={idx} className="h-2" />
        }
        
        // Regular paragraphs
        return <p key={idx} className="text-gray-700 leading-relaxed">{line}</p>
      })}
    </div>
  )
}