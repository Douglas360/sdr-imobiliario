'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Building2, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError('Email ou senha incorretos. Tente novamente.')
        } else {
            router.push('/')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(79,110,247,0.15) 0%, transparent 60%), rgb(13,17,27)' }}>

            {/* Grid bg decoration */}
            <div className="fixed inset-0 opacity-5"
                style={{ backgroundImage: 'linear-gradient(rgba(79,110,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(79,110,247,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black overflow-hidden border border-brand-500/30 mb-4 shadow-2xl shadow-brand-500/20">
                        <img 
                            src="/logo.png" 
                            alt="SDR Logo" 
                            className="w-full h-full object-cover"
                            style={{ mixBlendMode: 'screen' }}
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white">SDR Imobiliário</h1>
                    <p className="text-slate-400 text-sm mt-1">Corretor Digital 24/7</p>
                </div>

                {/* Card */}
                <div className="card p-8 space-y-6" style={{ background: 'rgba(20,26,40,0.9)', backdropFilter: 'blur(20px)' }}>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Entrar na plataforma</h2>
                        <p className="text-slate-400 text-sm mt-1">Acesse o painel da sua imobiliária</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="input pl-9"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input pl-9 pr-10"
                                    required
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-500">
                        Problemas para acessar? Entre em contato com o suporte.
                    </p>
                </div>
            </div>
        </div>
    )
}
