import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-5xl mx-auto p-6">{children}</div>
        </div>
      </body>
    </html>
  )
}