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
  // 1. Hardened Intent Styles with a fallback key
  const intentStyles: Record<string, { bg: string; text: string }> = {
    note: { bg: 'bg-blue-600', text: 'text-white' },
    retro: { bg: 'bg-purple-600', text: 'text-white' },
    reference: { bg: 'bg-green-600', text: 'text-white' },
    unknown: { bg: 'bg-gray-700', text: 'text-white' } // CRITICAL: Added unknown key
  };

  // 2. Safe Style Lookup (Using the fallback we just defined)
  const intentKey = artifact?.metadata?.intent || 'unknown';
  const intentStyle = intentStyles[intentKey] || intentStyles.unknown;

  const typeColors: Record<string, { bg: string; text: string; border: string }> = {
    RAW_COMMIT: { bg: 'bg-capture/10', text: 'text-capture', border: 'border-capture' },
    PROGRESS_SNAPSHOT: { bg: 'bg-measure/10', text: 'text-measure', border: 'border-measure' },
    BUILD_LOG: { bg: 'bg-build/10', text: 'text-build', border: 'border-build' },
    TEACHING_MOMENT: { bg: 'bg-transform/10', text: 'text-transform', border: 'border-transform' },
    SYSTEM_OBSERVATION: { bg: 'bg-publish/10', text: 'text-publish', border: 'border-publish' },
    PROJECT_EXPLAINER: { bg: 'bg-build/10', text: 'text-build', border: 'border-build' },
    LINK: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500' },
    UNKNOWN: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' }
  };

  const typeIcons: Record<string, string> = {
    RAW_COMMIT: '💻',
    PROGRESS_SNAPSHOT: '📝',
    BUILD_LOG: '🔨',
    TEACHING_MOMENT: '💡',
    SYSTEM_OBSERVATION: '👁️',
    PROJECT_EXPLAINER: '📖',
    LINK: '🔗',
    UNKNOWN: '❓'
  };

  // 3. Fallback for undefined types (Legacy Data Support)
  const colors = typeColors[artifact.type] || typeColors.UNKNOWN;
  const icon = typeIcons[artifact.type] || typeIcons.UNKNOWN;

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
        <div className="text-2xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.bg} ${colors.text}`}>
              {artifact.type.replace(/_/g, ' ')}
            </span>
            {/* Using intentStyle to visually badge the intent if it exists */}
            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${intentStyle.bg} ${intentStyle.text}`}>
              {intentKey}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {new Date(artifact.createdAt || artifact.timestamp).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-heading font-medium text-gray-900 truncate">
            {artifact.metadata?.title || 'Untitled Artifact'}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {artifact.metadata?.summary || 'No summary provided.'}
          </p>
          <div className="flex gap-1 mt-2">
            {(artifact.metadata?.tags || []).slice(0, 3).map((tag: string) => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}