'use client'
import { useState, useEffect, useCallback } from 'react'
import { Smartphone, CheckCircle2, XCircle, RefreshCw, Loader2, Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WhatsAppStatus {
    connected: boolean
    phone?: string
    profileName?: string
}

export default function WhatsAppPage() {
    const [status, setStatus] = useState<WhatsAppStatus | null>(null)
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [loadingQr, setLoadingQr] = useState(false)
    const [loadingDisconnect, setLoadingDisconnect] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/whatsapp/status')
            const data = await res.json()
            setStatus(data)
            if (data.connected) setQrCode(null)
        } catch { setError('Erro ao verificar status') }
    }, [])

    useEffect(() => {
        fetchStatus()
        const interval = setInterval(fetchStatus, 10000)
        return () => clearInterval(interval)
    }, [fetchStatus])

    async function handleConnect() {
        setLoadingQr(true)
        setError(null)
        try {
            const res = await fetch('/api/whatsapp/qrcode')
            const data = await res.json()
            if (data.qrcode) setQrCode(data.qrcode)
            else setError(data.error || 'Não foi possível gerar QR Code')
        } catch { setError('Erro ao conectar') }
        setLoadingQr(false)
    }

    async function handleDisconnect() {
        if (!confirm('Deseja realmente desconectar o WhatsApp?')) return
        setLoadingDisconnect(true)
        try {
            await fetch('/api/whatsapp/disconnect', { method: 'POST' })
            setStatus({ connected: false })
            setQrCode(null)
        } catch { setError('Erro ao desconectar') }
        setLoadingDisconnect(false)
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-white">Conexão WhatsApp</h1>
                <p className="text-slate-400 text-sm mt-1">Conecte o número da imobiliária para ativar o Corretor Digital</p>
            </div>

            {/* Status Card */}
            <div className="card p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center',
                            status?.connected ? 'bg-green-400/10' : 'bg-red-400/10')}>
                            <Smartphone className={cn('w-6 h-6', status?.connected ? 'text-green-400' : 'text-red-400')} />
                        </div>
                        <div>
                            <p className="text-white font-semibold">
                                {status?.connected ? 'WhatsApp Conectado' : 'WhatsApp Desconectado'}
                            </p>
                            {status?.connected && status.phone && (
                                <p className="text-slate-400 text-sm">+{status.phone}</p>
                            )}
                            {status?.connected && status.profileName && (
                                <p className="text-slate-500 text-xs">{status.profileName}</p>
                            )}
                            {!status && <p className="text-slate-500 text-sm">Verificando status...</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {status?.connected
                            ? <><WifiOff className="w-4 h-4 text-green-400" /></>
                            : <><Wifi className="w-4 h-4 text-red-400" /></>
                        }
                        <span className={cn('w-2 h-2 rounded-full animate-pulse',
                            status?.connected ? 'bg-green-400' : 'bg-red-400')} />
                    </div>
                </div>

                {error && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-3 mt-6">
                    {!status?.connected && (
                        <button onClick={handleConnect} disabled={loadingQr} className="btn-primary">
                            {loadingQr ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            {loadingQr ? 'Gerando QR Code...' : 'Conectar WhatsApp'}
                        </button>
                    )}
                    {status?.connected && (
                        <button onClick={handleDisconnect} disabled={loadingDisconnect}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all disabled:opacity-50">
                            {loadingDisconnect ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            Desconectar
                        </button>
                    )}
                    <button onClick={fetchStatus} className="btn-secondary">
                        <RefreshCw className="w-4 h-4" /> Atualizar
                    </button>
                </div>
            </div>

            {/* QR Code */}
            {qrCode && !status?.connected && (
                <div className="card p-6 text-center space-y-4">
                    <div>
                        <p className="text-white font-semibold">Escaneie o QR Code</p>
                        <p className="text-slate-400 text-sm mt-1">
                            Abra o WhatsApp → Dispositivos conectados → Conectar um dispositivo
                        </p>
                    </div>
                    <div className="inline-block p-4 bg-white rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrCode} alt="QR Code WhatsApp" className="w-64 h-64" />
                    </div>
                    <p className="text-slate-500 text-xs">O QR Code expira em 60 segundos. Clique em "Atualizar" se expirar.</p>
                </div>
            )}

            {/* Instructions */}
            <div className="card p-6 space-y-3">
                <p className="text-white font-medium text-sm">Como funciona</p>
                {[
                    'Clique em "Conectar WhatsApp" para gerar o QR Code',
                    'No celular, abra o WhatsApp e vá em Dispositivos conectados',
                    'Escaneie o QR Code com a câmera do app',
                    'Pronto! O bot começará a responder automaticamente',
                ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-medium">
                            {i + 1}
                        </span>
                        <p className="text-slate-400 text-sm">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
