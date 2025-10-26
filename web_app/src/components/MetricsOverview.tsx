import type { Artifact, PublishedFile } from '../types'

interface MetricsOverviewProps {
  artifacts: Artifact[]
  publishedFiles: PublishedFile[]
}

export function MetricsOverview({ artifacts, publishedFiles }: MetricsOverviewProps) {
  const commits = artifacts.filter(a => a.type === 'RAW_COMMIT').length
  const retros = artifacts.filter(a => a.type === 'PROGRESS_SNAPSHOT').length
  
  const latest = artifacts.length > 0 
    ? new Date(artifacts[artifacts.length - 1].createdAt).toLocaleString()
    : 'N/A'

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard 
        label="Total Artifacts"
        value={artifacts.length}
        icon="📦"
        color="build"
      />
      <MetricCard 
        label="Commits"
        value={commits}
        icon="💻"
        color="capture"
      />
      <MetricCard 
        label="Retros"
        value={retros}
        icon="📝"
        color="transform"
      />
      <MetricCard 
        label="Published"
        value={publishedFiles.length}
        icon="🚀"
        color="publish"
        subtitle={`Last: ${latest}`}
      />
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: number | string
  icon: string
  color: 'build' | 'capture' | 'transform' | 'publish' | 'measure'
  subtitle?: string
}

const colorClasses = {
  build: 'border-build bg-build/5',
  capture: 'border-capture bg-capture/5',
  transform: 'border-transform bg-transform/5',
  publish: 'border-publish bg-publish/5',
  measure: 'border-measure bg-measure/5',
}

function MetricCard({ label, value, icon, color, subtitle }: MetricCardProps) {
  return (
    <div className={`bg-surface rounded-lg border-2 ${colorClasses[color]} p-6 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-heading font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 font-mono">{subtitle}</p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}
