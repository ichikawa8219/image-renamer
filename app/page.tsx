import ImageRenamer from './components/ImageRenamer'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">画像ファイルリネームツール</h1>
      <ImageRenamer />
    </main>
  )
}

