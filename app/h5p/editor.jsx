'use client'
import React from 'react'

export default function EditorPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">H5P Editor (встроенный)</h2>
      <div className="bg-white p-4 rounded shadow">
        <p>В реальном приложении здесь будет встроенный H5P редактор. Для этого потребуется интеграция с h5p-nodejs-library.</p>
        <p className="mt-4">Для создания H5P контента используйте внешний редактор или интегрируйте H5P библиотеки.</p>
      </div>
    </div>
  )
}