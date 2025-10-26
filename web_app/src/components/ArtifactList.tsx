// src/components/ArtifactList.tsx

import React from 'react'
import type { Artifact } from '../types'

// Map artifact types to pipeline colors for visual clarity
const TYPE_COLORS: Record<string, string> = {
  RAW_COMMIT: 'border-l-4 border-orange-500', // Build/Capture stage color (using orange for simplicity)
  PROGRESS_SNAPSHOT: 'border-l-4 border-lime-500', // Transform/Measure stage color (using lime for simplicity)
  // Add other types/colors as needed: cyan, blue, pink
}

interface ArtifactListProps {
  artifacts: Artifact[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export const ArtifactList: React.FC<ArtifactListProps> = ({ artifacts, selectedId, onSelect }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden h-96 lg:h-full flex flex-col">
      <h2 className="text-xl font-semibold p-4 border-b text-gray-800">Artifacts List ({artifacts.length})</h2>
      <ul className="flex-grow overflow-y-auto divide-y divide-gray-100">
        {artifacts.length > 0 ? (
          artifacts.map((artifact) => (
            <li
              key={artifact.id}
              className={`p-4 cursor-pointer transition-colors ${
                artifact.id === selectedId
                  ? 'bg-blue-50/70 border-r-4 border-blue-600' // Highlight active item with blue accent
                  : 'hover:bg-gray-50'
              } ${TYPE_COLORS[artifact.type] || 'border-l-4 border-gray-300'}`}
              onClick={() => onSelect(artifact.id)}
            >
              <p className="font-medium text-gray-900">{artifact.metadata.title}</p>
              <p className="text-sm text-gray-500 mt-1">
                Type: <span className="font-mono text-xs bg-gray-100 rounded px-1">{artifact.type}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(artifact.createdAt).toLocaleString()}
              </p>
            </li>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No artifacts match the current filter.</div>
        )}
      </ul>
    </div>
  )
}
