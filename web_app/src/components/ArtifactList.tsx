import type { Artifact } from '../types'

interface ArtifactListProps {
  artifacts: Artifact[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ArtifactList({ artifacts, selectedId, onSelect }: ArtifactListProps) {
  if (artifacts.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-8 text-center">
        <p className="text-gray-500">No artifacts found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
        Artifacts ({artifacts.length})
      </h2>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {artifacts.map(artifact => (
          <ArtifactCard
            key={artifact.id}
            artifact={artifact}
            isSelected={artifact.id === selectedId}
            onClick={() => onSelect(artifact.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface ArtifactCardProps {
  artifact: Artifact
  isSelected: boolean
  onClick: () => void
}

function ArtifactCard({ artifact, isSelected, onClick }: ArtifactCardProps) {
  const typeColors = {
    RAW_COMMIT: {
      bg: 'bg-capture/10',
      text: 'text-capture',
      border: 'border-capture',
    },
    PROGRESS_SNAPSHOT: {
      bg: 'bg-measure/10',
      text: 'text-measure',
      border: 'border-measure',
    },
    BUILD_LOG: {
      bg: 'bg-build/10',
      text: 'text-build',
      border: 'border-build',
    },
    TEACHING_MOMENT: {
      bg: 'bg-transform/10',
      text: 'text-transform',
      border: 'border-transform',
    },
    SYSTEM_OBSERVATION: {
      bg: 'bg-publish/10',
      text: 'text-publish',
      border: 'border-publish',
    },
    PROJECT_EXPLAINER: {
      bg: 'bg-build/10',
      text: 'text-build',
      border: 'border-build',
    }
  }

  const typeIcons = {
    RAW_COMMIT: '💻',
    PROGRESS_SNAPSHOT: '📝',
    BUILD_LOG: '🔨',
    TEACHING_MOMENT: '💡',
    SYSTEM_OBSERVATION: '👁️',
    PROJECT_EXPLAINER: '📖'
  }

  const colors = typeColors[artifact.type]

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? `${colors.border} ${colors.bg} shadow-md`
          : 'border-border bg-surface hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{typeIcons[artifact.type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.bg} ${colors.text}`}>
              {artifact.type.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {new Date(artifact.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-heading font-medium text-gray-900 truncate">
            {artifact.metadata.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {artifact.metadata.summary}
          </p>
          <div className="flex gap-1 mt-2">
            {artifact.metadata.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}
