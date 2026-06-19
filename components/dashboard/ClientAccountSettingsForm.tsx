'use client'

import { FormEvent, useState } from 'react'

type Props = {
  initialName: string
  initialEmail: string
  initialPhone: string
}

export default function ClientAccountSettingsForm({
  initialName,
  initialEmail,
  initialPhone,
}: Props) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [phone, setPhone] = useState(initialPhone)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(payload.error || 'Falha ao atualizar dados')
        return
      }

      setMessage(payload.message || 'Dados atualizados com sucesso')
    } catch {
      setError('Falha de rede ao atualizar dados')
    } finally {
      setBusy(false)
    }
  }

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')

    if (newPassword.length < 8) {
      setError('A nova senha deve ter no minimo 8 caracteres')
      setBusy(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('A confirmacao de senha nao confere')
      setBusy(false)
      return
    }

    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(payload.error || 'Falha ao atualizar senha')
        return
      }

      setMessage('Senha atualizada com sucesso')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setError('Falha de rede ao atualizar senha')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={saveProfile} className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Dados da conta</h2>

        <label className="block text-sm">
          <span className="mb-1 block text-gray-600">Nome</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-gray-600">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-gray-600">Telefone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-70"
        >
          {busy ? 'Salvando...' : 'Salvar dados'}
        </button>
      </form>

      <form onSubmit={savePassword} className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Alterar senha</h2>

        <label className="block text-sm">
          <span className="mb-1 block text-gray-600">Nova senha</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-gray-600">Confirmar nova senha</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-70"
        >
          {busy ? 'Salvando...' : 'Salvar senha'}
        </button>
      </form>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
    </div>
  )
}
