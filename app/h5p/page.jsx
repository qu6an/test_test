'use client'

import dynamic from 'next/dynamic'

const H5PPlayer = dynamic(() => import('../../components/H5PPlayer'), { ssr: false })
const H5PEditor = dynamic(() => import('../../components/H5PEditor'), { ssr: false })

export default function H5PPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">H5P: Player и Editor</h2>
      <div className="space-y-6">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-2">Player (просмотр)</h3>
          <H5PPlayer />
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-2">Editor (создать / редактировать тест)</h3>
          <H5PEditor />
        </div>
      </div>
    </div>
  )
}