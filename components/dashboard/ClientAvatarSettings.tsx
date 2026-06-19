'use client'

import { type ChangeEvent, useRef, useState } from 'react'
import { Camera } from 'lucide-react'

type ClientAvatarSettingsProps = {
  userName: string
  initialAvatar: string | null
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SS'
}

function convertImageToSquareDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const src = typeof reader.result === 'string' ? reader.result : null
      if (!src) {
        reject(new Error('Falha ao ler arquivo'))
        return
      }

      const image = new Image()
      image.onload = () => {
        const size = 256
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')

        if (!context) {
          reject(new Error('Canvas indisponivel'))
          return
        }

        const minSide = Math.min(image.width, image.height)
        const sx = (image.width - minSide) / 2
        const sy = (image.height - minSide) / 2

        context.drawImage(image, sx, sy, minSide, minSide, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }

      image.onerror = () => reject(new Error('Arquivo invalido'))
      image.src = src
    }

    reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
    reader.readAsDataURL(file)
  })
}

export default function ClientAvatarSettings({ userName, initialAvatar }: ClientAvatarSettingsProps) {
  const [avatar, setAvatar] = useState<string | null>(initialAvatar)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onSelectImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.currentTarget.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Selecione uma imagem valida')
      setSuccess('')
      return
    }

    setBusy(true)
    setError('')
    setSuccess('')

    try {
      const avatarDataUrl = await convertImageToSquareDataUrl(file)
      const response = await fetch('/api/account/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarDataUrl }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(payload.error || 'Nao foi possivel salvar foto')
        return
      }

      setAvatar(payload.avatar || avatarDataUrl)
      setSuccess('Foto atualizada com sucesso')
    } catch {
      setError('Nao foi possivel processar a imagem')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Foto de perfil</h2>
      <div className="flex items-center gap-4">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={userName} className="h-16 w-16 rounded-full object-cover border border-gray-200" />
        ) : (
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
            {getInitials(userName)}
          </span>
        )}
        <div>
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            aria-label="Selecionar nova foto de perfil"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <Camera size={16} />
            {busy ? 'Processando...' : 'Alterar foto'}
          </button>
          <p className="mt-2 text-xs text-gray-500">A imagem sera centralizada e salva em 256x256.</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label="Selecionar imagem de avatar"
        className="hidden"
        onChange={onSelectImage}
      />

      {error && <p role="alert" className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
      {success && <p role="status" aria-live="polite" className="text-sm text-green-700 bg-green-50 p-2 rounded">{success}</p>}
    </div>
  )
}
