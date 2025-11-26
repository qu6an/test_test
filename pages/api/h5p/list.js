import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const dir = path.join(process.cwd(), 'data', 'h5p')
  if (!fs.existsSync(dir)) return res.json([])
  const files = fs.readdirSync(dir).map((f, idx) => ({ id: idx + 1, name: f, file: '/data/h5p/' + f }))
  res.json(files)
}