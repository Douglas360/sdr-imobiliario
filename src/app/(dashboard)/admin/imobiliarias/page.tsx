'use client'
import { useState, useEffect, useCallback } from 'react'
import {
    Building2, Plus, Edit2, Trash2, Smartphone, 
    CheckCircle2, XCircle, Loader2, RefreshCw, Smartphone as PhoneIcon,
    Search, X, ExternalLink
} from 'lucide-react'

type Tenant = {
    id: string
    name: string
    evolution_instance: string
    whatsapp_connected: boolean
    created_at: string
}

function CreateTenantModal({
    onClose,
    onSuccess,
    initialData
}: {
    onClose: () => void
    onSuccess: () => void
    initialData?: Tenant
}) {
    const [form, setForm] = useState({ 
        name: initialData?.name || '', 
        evolution_instance: initialData?.evolution_instance || '',
        admin_name: '',
        admin_email: '',
        admin_password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const method = initialData ? 'PATCH' : 'POST'
            const res = await fetch('/api/admin/tenants', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(initialData ? { ...form, id: initialData.id } : form),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Erro ao salvar imobiliária.')
                return
            }
            onSuccess()
        } catch (err) {
            setError('Erro de conexão.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="card w-full max-w-lg p-0 overflow-hidden"
                style={{ background: 'rgba(18,24,38,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}>

                <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--border))]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-semibold text-base">
                                {initialData ? 'Editar Imobiliária' : 'Nova Imobiliária'}
                            </h2>
                            <p className="text-slate-500 text-xs">Configure os dados do cliente e acesso</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                            <XCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Seção Imobiliária */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest px-1">Dados da Imobiliária</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 space-y-1">
                                <label className="text-sm font-medium text-slate-300">Nome da Imobiliária</label>
                                <input 
                                    value={form.name} 
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Ex: Imobiliária Silva" 
                                    className="input w-full" 
                                    required 
                                />
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="text-sm font-medium text-slate-300">Instância Evolution (WhatsApp)</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input 
                                        value={form.evolution_instance} 
                                        onChange={e => setForm(f => ({ ...f, evolution_instance: e.target.value }))}
                                        placeholder="Ex: imob-silva" 
                                        className="input pl-9 w-full" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seção Dono/Admin (apenas na criação) */}
                    {!initialData && (
                        <div className="space-y-3 pt-2 border-t border-white/5">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-1">Acesso do Administrador</p>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-300">Nome do Responsável</label>
                                    <input 
                                        value={form.admin_name} 
                                        onChange={e => setForm(f => ({ ...f, admin_name: e.target.value }))}
                                        placeholder="Nome do dono ou gerente" 
                                        className="input w-full" 
                                        required={!initialData}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-300">Email de Login</label>
                                        <input 
                                            type="email"
                                            value={form.admin_email} 
                                            onChange={e => setForm(f => ({ ...f, admin_email: e.target.value }))}
                                            placeholder="admin@email.com" 
                                            className="input w-full" 
                                            required={!initialData}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-300">Senha</label>
                                        <input 
                                            type="password"
                                            value={form.admin_password} 
                                            onChange={e => setForm(f => ({ ...f, admin_password: e.target.value }))}
                                            placeholder="Senha inicial" 
                                            className="input w-full" 
                                            required={!initialData}
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-white/5">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#000' }}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            {loading ? 'Processando...' : initialData ? 'Salvar Alterações' : 'Criar Imobiliária e Acesso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function AdminImobiliariasPage() {
    const [tenants, setTenants] = useState<Tenant[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingTenant, setEditingTenant] = useState<Tenant | undefined>()
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    const fetchTenants = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/tenants')
            const data = await res.json()
            setTenants(data.tenants || [])
        } catch {
            showToast('Erro ao carregar imobiliárias.', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchTenants() }, [fetchTenants])

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente excluir esta imobiliária? Todos os dados (imóveis, leads, usuários) vinculados serão afetados.')) return
        try {
            const res = await fetch(`/api/admin/tenants?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            showToast('Imobiliária excluída com sucesso.')
            fetchTenants()
        } catch {
            showToast('Erro ao excluir imobiliária.', 'error')
        }
    }

    const filtered = tenants.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.evolution_instance.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl flex items-center gap-2 transition-all
                    ${toast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-amber-400" />
                        </div>
                        Gerenciar Imobiliárias
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 ml-14">
                        Adicione novos clientes (tenants) e configure suas instâncias de WhatsApp.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchTenants} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => { setEditingTenant(undefined); setShowModal(true) }}
                        className="btn-primary flex items-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#000' }}>
                        <Plus className="w-4 h-4" />
                        Nova Imobiliária
                    </button>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por nome ou instância..."
                        className="input pl-9 w-full" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="card h-40 animate-pulse bg-white/5" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-20 text-center space-y-3">
                        <Building2 className="w-12 h-12 text-slate-700 mx-auto" />
                        <p className="text-slate-500">Nenhuma imobiliária encontrada.</p>
                    </div>
                ) : (
                    filtered.map(tenant => (
                        <div key={tenant.id} className="card p-5 group hover:border-amber-500/30 transition-all border border-transparent bg-white/[0.02]">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-brand-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-white font-semibold truncate pr-2">{tenant.name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <PhoneIcon className="w-3 h-3" />
                                            <span className="truncate">{tenant.evolution_instance}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingTenant(tenant); setShowModal(true) }}
                                        className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(tenant.id)}
                                        className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    {tenant.whatsapp_connected ? (
                                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-green-400 uppercase tracking-wider">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            Conectado
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                            Desconectado
                                        </div>
                                    )}
                                </div>
                                <div className="text-[10px] text-slate-600">
                                    ID: {tenant.id.slice(0, 8)}...
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <CreateTenantModal
                    onClose={() => setShowModal(false)}
                    initialData={editingTenant}
                    onSuccess={() => {
                        setShowModal(false)
                        showToast(editingTenant ? 'Imobiliária atualizada!' : 'Imobiliária criada com sucesso!')
                        fetchTenants()
                    }}
                />
            )}
        </div>
    )
}
