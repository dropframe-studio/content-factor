// src/components/MetricsOverview.tsx

import React from 'react'
import type { Artifact, PublishedFile } from '../types'

interface MetricsOverviewProps {
  artifacts: Artifact[]
  publishedFiles: PublishedFile[]
}

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 border-t-4" style={{ borderColor: color }}>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
  </div>
)

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ artifacts, publishedFiles }) => {
  const totalArtifacts = artifacts.length
  const totalPublished = publishedFiles.length
  const commitCount = artifacts.filter(a => a.type === 'RAW_COMMIT').length
  const retroCount = artifacts.filter(a => a.type === 'PROGRESS_SNAPSHOT').length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard 
        title="Total Artifacts" 
        value={totalArtifacts.toString()} 
        color="#F97316" // Pipeline Orange (Build)
      />
      <StatCard 
        title="Raw Commits" 
        value={commitCount.toString()} 
        color="#06B6D4" // Pipeline Cyan (Capture)
      />
      <StatCard 
        title="Progress Snapshots" 
        value={retroCount.toString()} 
        color="#84CC16" // Pipeline Lime (Transform)
      />
      <StatCard 
        title="Files Published" 
        value={totalPublished.toString()} 
        color="#3B82F6" // Pipeline Blue (Publish)
      />
    </div>
  )
}
