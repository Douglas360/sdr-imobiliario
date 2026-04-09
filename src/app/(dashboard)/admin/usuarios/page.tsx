'use client'
import { useState, useEffect, useCallback } from 'react'
import {
    Users, UserPlus, Shield, CheckCircle2, XCircle,
    Loader2, Trash2, Eye, EyeOff, MoreVertical, RefreshCw,
    Mail, Building2, Search, X
} from 'lucide-react'

type User = {
    id: string
    name: string
    email: string
    role: string
    tenant_id: string
    tenant: { id: string; name: string } | null
    banned: boolean
    email_confirmed: boolean
    last_sign_in: string | null
    created_at: string | null
}

type Tenant = { id: string; name: string }

function formatDate(dateStr: string | null) {
    if (!dateStr) return 'Nunca'
    try {
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr))
    } catch {
        return 'Inválido'
    }
}

function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, string> = {
        admin: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
        manager: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        user: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    }
    const labels: Record<string, string> = { admin: 'Admin', manager: 'Gerente', user: 'Corretor' }
    const cls = styles[role] || styles.user
    return (
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cls}`}>
            {role === 'admin' && <Shield className="w-2.5 h-2.5" />}
            {labels[role] || role}
        </span>
    )
}

// ——— Modal de criação de usuário ———————————————————————————
function CreateUserModal({
    tenants,
    onClose,
    onSuccess,
}: {
    tenants: Tenant[]
    onClose: () => void
    onSuccess: () => void
}) {
    const [form, setForm] = useState({ email: '', password: '', name: '', role: 'viewer', tenant_id: '' })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Erro ao criar usuário.')
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

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--border))]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <UserPlus className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-semibold text-base">Novo Usuário</h2>
                            <p className="text-slate-500 text-xs">Criar acesso à plataforma</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                            <XCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1">
                            <label className="text-sm font-medium text-slate-300">Nome completo</label>
                            <input name="name" value={form.name} onChange={handleChange}
                                placeholder="João Silva" className="input w-full" />
                        </div>

                        <div className="col-span-2 space-y-1">
                            <label className="text-sm font-medium text-slate-300">Email <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input name="email" type="email" value={form.email} onChange={handleChange}
                                    placeholder="corretor@imob.com" className="input pl-9 w-full" required />
                            </div>
                        </div>

                        <div className="col-span-2 space-y-1">
                            <label className="text-sm font-medium text-slate-300">Senha <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <input name="password" type={showPass ? 'text' : 'password'}
                                    value={form.password} onChange={handleChange}
                                    placeholder="Mínimo 6 caracteres" className="input pr-10 w-full" required minLength={6} />
                                <button type="button" onClick={() => setShowPass(s => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Perfil</label>
                            <select name="role" value={form.role} onChange={handleChange} className="input w-full">
                                <option value="viewer">Corretor (Viewer)</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Imobiliária <span className="text-red-400">*</span></label>
                            <select name="tenant_id" value={form.tenant_id} onChange={handleChange} className="input w-full" required>
                                <option value="">Selecione...</option>
                                {tenants.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="btn-secondary flex-1 justify-center">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}
                            className="btn-primary flex-1 justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#000' }}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                            {loading ? 'Criando...' : 'Criar Usuário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ——— Linha de usuário ————————————————————————————————————
function UserRow({ user, onAction }: {
    user: User
    onAction: (action: 'ban' | 'unban' | 'delete', id: string) => void
}) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <tr className="border-b border-[rgb(var(--border))] hover:bg-white/[0.02] group transition-colors">
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                        <span className="text-brand-400 text-xs font-bold">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-sm font-medium leading-tight truncate">{user.name || '—'}</p>
                        <p className="text-slate-500 text-xs truncate">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3.5">
                <RoleBadge role={user.role} />
            </td>
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span className="text-slate-300 text-sm">{user.tenant?.name || '—'}</span>
                </div>
            </td>
            <td className="px-4 py-3.5">
                {user.banned ? (
                    <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Bloqueado
                    </span>
                ) : user.email_confirmed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Ativo
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                        <Mail className="w-3 h-3" /> Aguardando
                    </span>
                )}
            </td>
            <td className="px-4 py-3.5 text-slate-500 text-xs">{formatDate(user.last_sign_in)}</td>
            <td className="px-4 py-3.5 text-slate-500 text-xs">{formatDate(user.created_at)}</td>
            <td className="px-4 py-3.5">
                <div className="relative flex justify-end">
                    <button onClick={() => setMenuOpen(s => !s)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                            <div className="absolute right-0 top-8 z-20 card min-w-44 py-1 shadow-2xl"
                                style={{ background: 'rgba(22,28,44,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {user.banned ? (
                                    <button
                                        onClick={() => { onAction('unban', user.id); setMenuOpen(false) }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-400 hover:bg-white/5 transition-colors">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Reativar usuário
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { onAction('ban', user.id); setMenuOpen(false) }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-yellow-400 hover:bg-white/5 transition-colors">
                                        <XCircle className="w-3.5 h-3.5" /> Bloquear usuário
                                    </button>
                                )}
                                <div className="border-t border-[rgb(var(--border))] my-1" />
                                <button
                                    onClick={() => { onAction('delete', user.id); setMenuOpen(false) }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" /> Excluir permanente
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}

// ——— Página principal ——————————————————————————————————
export default function AdminUsuariosPage() {
    const [users, setUsers] = useState<User[]>([])
    const [tenants, setTenants] = useState<Tenant[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterTenant, setFilterTenant] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [usersRes, tenantsRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/tenants'),
            ])
            const usersData = await usersRes.json()
            const tenantsData = await tenantsRes.json()
            setUsers(usersData.users || [])
            setTenants(tenantsData.tenants || [])
        } catch {
            showToast('Erro ao carregar dados.', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    const handleAction = async (action: 'ban' | 'unban' | 'delete', id: string) => {
        if (action === 'delete') {
            if (!confirm('Excluir este usuário permanentemente? Esta ação não pode ser desfeita.')) return
        }
        setActionLoading(id)
        try {
            let res: Response
            if (action === 'delete') {
                res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
            } else {
                res = await fetch(`/api/admin/users/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ banned: action === 'ban' }),
                })
            }
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            showToast(
                action === 'delete' ? 'Usuário excluído.' :
                    action === 'ban' ? 'Usuário bloqueado.' : 'Usuário reativado.'
            )
            fetchData()
        } catch (err: any) {
            showToast(err.message || 'Erro ao executar ação.', 'error')
        } finally {
            setActionLoading(null)
        }
    }

    const filtered = users.filter(u => {
        const matchSearch = !search ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        const matchTenant = !filterTenant || u.tenant_id === filterTenant
        return matchSearch && matchTenant
    })

    const stats = {
        total: users.length,
        active: users.filter(u => !u.banned && u.email_confirmed).length,
        blocked: users.filter(u => u.banned).length,
        pending: users.filter(u => !u.email_confirmed && !u.banned).length,
    }

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl flex items-center gap-2 transition-all
                    ${toast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-amber-400" />
                        </div>
                        Gerenciar Usuários
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 ml-14">
                        Cadastre corretores e equipe, vincule às imobiliárias e controle os acessos.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" title="Atualizar">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#000' }}>
                        <UserPlus className="w-4 h-4" />
                        Novo Usuário
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-white/5' },
                    { label: 'Ativos', value: stats.active, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Bloqueados', value: stats.blocked, color: 'text-red-400', bg: 'bg-red-500/10' },
                    { label: 'Aguardando', value: stats.pending, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                ].map(s => (
                    <div key={s.label} className="card p-4">
                        <p className="text-slate-500 text-xs mb-1">{s.label}</p>
                        <div className={`inline-flex items-baseline gap-1 px-2 py-0.5 rounded-lg ${s.bg}`}>
                            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por nome ou email..."
                        className="input pl-9 w-full" />
                </div>
                <select value={filterTenant} onChange={e => setFilterTenant(e.target.value)} className="input">
                    <option value="">Todas as imobiliárias</option>
                    {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="card overflow-hidden p-0">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Users className="w-12 h-12 text-slate-700 mb-3" />
                        <p className="text-slate-400 font-medium">Nenhum usuário encontrado</p>
                        <p className="text-slate-600 text-sm mt-1">
                            {search || filterTenant ? 'Tente ajustar os filtros.' : 'Crie o primeiro usuário usando o botão acima.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[rgb(var(--border))]">
                                    {['Usuário', 'Perfil', 'Imobiliária', 'Status', 'Último Acesso', 'Criado em', ''].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(user => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        onAction={handleAction}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <div className="px-5 py-3 border-t border-[rgb(var(--border))] text-xs text-slate-600">
                            {filtered.length} de {users.length} usuários
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <CreateUserModal
                    tenants={tenants}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false)
                        showToast('Usuário criado com sucesso!')
                        fetchData()
                    }}
                />
            )}
        </div>
    )
}
