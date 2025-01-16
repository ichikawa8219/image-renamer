'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, ImageIcon, Hash } from 'lucide-react'
import { shuffleArray } from '@/lib/utils'
import JSZip from 'jszip'
import { toast } from "sonner"

export default function ImageRenamer() {
  const [files, setFiles] = useState<File[]>([])
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [progress, setProgress] = useState(0)
  const [isRenaming, setIsRenaming] = useState(false)
  const [fileUrls, setFileUrls] = useState<string[]>([])

  useEffect(() => {
    return () => {
      fileUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [fileUrls])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      fileUrls.forEach(url => URL.revokeObjectURL(url))
      
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      )
      
      if (selectedFiles.length === 0) {
        toast.error('画像ファイルを選択してください')
        return
      }

      if (selectedFiles.length !== Array.from(e.target.files).length) {
        toast.warning('画像ファイル以外は除外されました')
      }

      const urls = selectedFiles.map(file => URL.createObjectURL(file))
      setFileUrls(urls)
      setFiles(selectedFiles)
    }
  }, [fileUrls])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      fileUrls.forEach(url => URL.revokeObjectURL(url))

      const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      )

      if (droppedFiles.length === 0) {
        toast.error('画像ファイルをドロップしてください')
        return
      }

      if (droppedFiles.length !== e.dataTransfer.files.length) {
        toast.warning('画像ファイル以外は除外されました')
      }

      const urls = droppedFiles.map(file => URL.createObjectURL(file))
      setFileUrls(urls)
      setFiles(droppedFiles)
    }
  }, [fileUrls])

  const preventDefault = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const getNewFileName = (index: number, extension: string) => {
    const paddedNumber = (index + 1).toString().padStart(4, '0')
    return `${prefix}${paddedNumber}${suffix}.${extension}`
  }

  const renameFiles = async () => {
    try {
      setIsRenaming(true)
      setProgress(0)

      // ファイルをランダムに並び替え
      const shuffledFiles = shuffleArray([...files])
      const zip = new JSZip()
      
      // 進捗計算用の変数
      const totalSteps = shuffledFiles.length
      let completedSteps = 0

      // 各ファイルを処理
      for (const [index, file] of shuffledFiles.entries()) {
        const extension = file.name.split('.').pop() || 'jpg'
        const newName = getNewFileName(index, extension)
        
        // ファイルをZIPに追加
        zip.file(newName, file)
        
        // 進捗を更新
        completedSteps++
        setProgress((completedSteps / totalSteps) * 100)
        
        // UIの更新のために少し待機
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      // ZIPファイルを生成してダウンロード
      const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      })

      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = 'renamed_images.zip'
      a.click()
      URL.revokeObjectURL(url)

      toast.success('リネームが完了しました')
    } catch (error) {
      console.error('Error during renaming:', error)
      toast.error('リネーム処理中にエラーが発生しました')
    } finally {
      setIsRenaming(false)
      setProgress(0)
    }
  }

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center"
        onDrop={handleDrop}
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">ここに画像をドラッグ＆ドロップするか、クリックしてファイルを選択してください</p>
        <div className="mt-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload" 
            className="inline-block"
          >
            <Button 
              variant="outline" 
              className="cursor-pointer"
              type="button"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              ファイルを選択
            </Button>
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">アップロードされた画像 ({files.length}枚)</h2>
          <div className="grid grid-cols-6 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={fileUrls[index]}
                  alt={`アップロード ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <ImageIcon className="text-white h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="prefix">接頭辞</Label>
          <Input
            id="prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="接頭辞を入力"
          />
        </div>
        <div>
          <Label htmlFor="suffix">接尾辞</Label>
          <Input
            id="suffix"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder="接尾辞を入力"
          />
        </div>
      </div>

      {isRenaming && (
        <div className="mb-6">
          <Label>リネーム進捗</Label>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 text-center mt-1">
            {Math.round(progress)}%
          </p>
        </div>
      )}

      <Button 
        className="w-full" 
        disabled={files.length === 0 || isRenaming}
        onClick={renameFiles}
      >
        {isRenaming ? 'リネーム中...' : 'ファイルをリネーム'}
      </Button>
    </div>
  )
}
