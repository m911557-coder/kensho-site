'use client'

import { useEffect, useState } from 'react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

type Status = 'idle' | 'loading' | 'subscribed' | 'unsupported' | 'denied' | 'error'

function isPushSupported() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window
}

export default function NotifyButton() {
  const [status, setStatus] = useState<Status>(() => (isPushSupported() ? 'idle' : 'unsupported'))

  useEffect(() => {
    if (!isPushSupported()) return
    navigator.serviceWorker.register('/kushio-sw.js').catch(() => {})

    navigator.serviceWorker.ready.then(async (reg) => {
      const existing = await reg.pushManager.getSubscription()
      if (existing) setStatus('subscribed')
    })
  }, [])

  async function handleEnable() {
    setStatus('loading')
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus('denied')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      const res = await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
      if (!res.ok) throw new Error('subscribe failed')

      setStatus('subscribed')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'unsupported') {
    return (
      <p className="text-center text-xs text-gray-400 mt-2">
        この端末・ブラウザではプッシュ通知に対応していません。ホーム画面に追加してから開くとご利用いただけます。
      </p>
    )
  }

  if (status === 'subscribed') {
    return (
      <p className="text-center text-sm text-sky-700 bg-sky-100 rounded-xl py-3 mt-2">
        ✅ プッシュ通知が有効です（中・高判定の時にお知らせします）
      </p>
    )
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleEnable}
        disabled={status === 'loading'}
        className="w-full bg-gradient-to-r from-sky-600 to-sky-400 text-white font-bold py-3 rounded-xl disabled:opacity-60"
      >
        {status === 'loading' ? '設定中...' : '🔔 プッシュ通知を有効にする'}
      </button>
      {status === 'denied' && (
        <p className="text-center text-xs text-red-500 mt-2">
          通知が許可されませんでした。端末の設定から通知を許可してください。
        </p>
      )}
      {status === 'error' && (
        <p className="text-center text-xs text-red-500 mt-2">
          設定に失敗しました。ホーム画面に追加してから再度お試しください。
        </p>
      )}
    </div>
  )
}
