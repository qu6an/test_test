import nextConnect from 'next-connect'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Простая локальная загрузка в папку ./data/h5p
const upload = multer({ dest: './data/h5p/uploads' })

const handler = nextConnect()
handler.use(upload.single('h5p'))

handler.post(async (req, res) => {
  try {
    // Файл пришёл в req.file
    const file = req.file
    if (!file) return res.status(400).json({ error: 'No file' })

    // Для демонстрации — просто переместим файл в data/h5p
    const destDir = path.join(process.cwd(), 'data', 'h5p')
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

    const dest = path.join(destDir, file.originalname || file.filename + '.h5p')
    fs.renameSync(file.path, dest)

    // В реальности здесь нужно зарегистрировать контент в H5P-server (h5p-nodejs-library)

    res.json({ ok: true, path: '/data/h5p/' + path.basename(dest) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler