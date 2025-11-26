'use client'
import React, { useEffect, useState } from 'react'

export default function H5PPlayer() {
  const [contentId, setContentId] = useState(null)

  useEffect(() => {
    // Попробуем загрузить последний сохранённый контент
    fetch('/api/h5p/list')
      .then(r => r.json())
      .then(data => {
        if (data && data.length) setContentId(data[0].id)
      })
  }, [])

  if (!contentId) return <div>Контент не найден. Создайте тест через редактор ниже.</div>

  return (
    <div>
      <iframe
        src={`/api/h5p/content/${contentId}/embed`}
        width="100%"
        height="400px"
        frameBorder="0"
      ></iframe>
    </div>
  )
}