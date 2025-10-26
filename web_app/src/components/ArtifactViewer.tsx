// src/components/ArtifactViewer.tsx

import React from 'react'
import type { PublishedFile } from '../types'

interface ArtifactViewerProps {
  artifactId: string | null
  publishedFiles: PublishedFile[]
}

export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({ artifactId, publishedFiles }) => {
  const publishedFile = publishedFiles.find(f => f.id === artifactId)

  if (!artifactId) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">Select an artifact from the list to view its details and published output.</p>
      </div>
    )
  }

  if (!publishedFile) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">No published file found for this artifact ID: <span className="font-mono text-sm">{artifactId}</span></p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden h-full">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">Artifact Details</h2>
        <p className="text-sm text-gray-500 font-mono mt-1">File: {publishedFile.filename}</p>
      </div>
      <div className="p-4 overflow-y-auto max-h-[85vh] lg:max-h-full"> {/* Adjust max-height as needed */}
        {/* Render markdown content in a fixed-width, technical style */}
        <pre className="p-4 bg-gray-800 text-green-300 rounded-md shadow-inner font-mono text-sm whitespace-pre-wrap">
          {publishedFile.content}
        </pre>
      </div>
    </div>
  )
}
