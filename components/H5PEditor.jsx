'use client'
import React from 'react'

export default function H5PEditor() {
  return (
    <div>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          // Открываем редактор в новой вкладке/модуле
          const win = window.open('/h5p/editor', '_blank')
          if (!win) alert('Откройте попапы/включите всплывающие окна')
        }}
      >Создать тест</button>

      <div>
        <p className="text-sm text-gray-600">(Редактор откроется в новом окне. После создания — используйте Player.)</p>
      </div>
    </div>
  )
}