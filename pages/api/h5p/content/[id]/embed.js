import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { id } = req.query
  const dir = path.join(process.cwd(), 'data', 'h5p')
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : []
  const idx = Number(id) - 1
  if (!files[idx]) return res.status(404).send('Not found')

  const filePath = path.join(dir, files[idx])
  // Для демонстрации — отдадим простой HTML-обёртку, в реальности H5P player отдаёт полноценный JS/CSS
  const html = `<html><body><h3>H5P content placeholder: ${files[idx]}</h3><p>Для реального проигрывания используйте h5p-nodejs-library + H5P player assets.</p></body></html>`
  res.setHeader('Content-Type', 'text/html')
  res.send(html)
}