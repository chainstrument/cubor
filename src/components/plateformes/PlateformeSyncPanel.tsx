'use client'

import { useState } from 'react'

interface PlateformeSyncPanelProps {
  plateformeId: number
  provider?: string | null
  oauthStatus?: string | null
  lastSyncAt?: string | null
  syncStatus?: string | null
}

export default function PlateformeSyncPanel({
  plateformeId,
  provider,
  oauthStatus,
  lastSyncAt,
  syncStatus,
}: PlateformeSyncPanelProps) {
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [currentProvider, setCurrentProvider] = useState(provider ?? 'youtube')
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  async function handleSaveTokens(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      const response = await fetch(`/api/plateformes/${plateformeId}/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: currentProvider,
          accessToken,
          refreshToken,
          expiresAt,
        }),
      })

      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload.error || 'Échec de l’enregistrement OAuth')
      }

      setMessage('Tokens OAuth enregistrés. Prêt à synchroniser.')
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSync() {
    setIsSyncing(true)
    setMessage('')

    try {
      const response = await fetch(`/api/plateformes/${plateformeId}/sync`, {
        method: 'POST',
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Échec de la synchronisation')
      }

      setMessage(payload.log?.message ?? 'Synchronisation effectuée.')
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Intégration API</h2>
          <p className="mt-2 text-sm text-slate-400">Gère l’authentification OAuth et la synchronisation automatique des stats.</p>
        </div>
        <div className="space-y-1 text-right text-sm text-slate-300">
          <p>Provider : {currentProvider}</p>
          <p>Statut OAuth : {oauthStatus ?? 'non configuré'}</p>
          <p>Dernière synchronisation : {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Jamais'}</p>
          <p>Etat sync : {syncStatus ?? 'inconnu'}</p>
        </div>
      </div>

      <form onSubmit={handleSaveTokens} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Provider</label>
            <input
              value={currentProvider}
              onChange={(event) => setCurrentProvider(event.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="youtube"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Date d'expiration</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Access token</label>
            <input
              value={accessToken}
              onChange={(event) => setAccessToken(event.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="Valeur du token"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Refresh token</label>
            <input
              value={refreshToken}
              onChange={(event) => setRefreshToken(event.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="Valeur du refresh token"
            />
          </div>
        </div>

        {message ? <p className="text-sm text-slate-300">{message}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer OAuth'}
          </button>
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSyncing ? 'Synchronisation...' : 'Lancer la synchronisation'}
          </button>
        </div>
      </form>
    </div>
  )
}
