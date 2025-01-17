import React from 'react'
import ImageRenamer from './components/ImageRenamer'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">画像ファイルリネームツール</h1>
      <ImageRenamer />
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">使用方法</h2>
        <div className="space-y-4">
          <section>
            <h3 className="text-lg font-medium mb-2">📝 基本的な使い方</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>画像ファイルをドラッグ＆ドロップするか、「ファイルを選択」ボタンから画像を選択します</li>
              <li>必要に応じて接頭辞・接尾辞を入力します（例: 「vacation_」「_2024」など）</li>
              <li>「ファイルをリネーム」ボタンをクリックします</li>
              <li>処理が完了すると、リネームされた画像ファイルがZIPファイルとしてダウンロードされます</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">🔍 機能の特徴</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>複数の画像ファイルを一括でリネーム</li>
              <li>ランダムな順序でリネーム（0001から連番）</li>
              <li>接頭辞・接尾辞の追加が可能</li>
              <li>処理の進捗をリアルタイムで表示</li>
              <li>ZIPファイルとして一括ダウンロード</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">💡 Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>対応している画像形式: JPG, PNG, GIF, WebP など</li>
              <li>画像以外のファイルは自動的に除外されます</li>
              <li>ファイル名は「[接頭辞][連番][接尾辞]」の形式で生成されます</li>
              <li>連番は4桁の数字（0001から開始）で生成されます</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}

