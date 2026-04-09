'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lead } from '@/types'
import { cn, formatPhone, formatCurrency, timeAgo, getStatusColor } from '@/lib/utils'
import { Users, Search, Phone, DollarSign, MapPin, Clock } from 'lucide-react'

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const supabase = createClient()

    useEffect(() => {
        loadLeads()
        const channel = supabase.channel('leads')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, loadLeads)
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [])

    async function loadLeads() {
        const { data } = await supabase
            .from('leads').select('*').order('last_contact', { ascending: false })
        setLeads(data || [])
        setLoading(false)
    }

    async function updateStatus(id: string, status: Lead['status']) {
        await supabase.from('leads').update({ status }).eq('id', id)
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    }

    const filtered = leads.filter(l => {
        const q = search.toLowerCase()
        const matchSearch = !q || l.name?.toLowerCase().includes(q) || l.phone.includes(q) || l.neighborhood?.toLowerCase().includes(q) || false
        const matchStatus = !filterStatus || l.status === filterStatus
        return matchSearch && matchStatus
    })

    const statusCounts = {
        all: leads.length,
        Frio: leads.filter(l => l.status === 'Frio').length,
        Quente: leads.filter(l => l.status === 'Quente').length,
        'Agendou Visita': leads.filter(l => l.status === 'Agendou Visita').length,
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Leads</h1>
                    <p className="text-slate-400 text-sm mt-1">{leads.length} leads qualificados pelo Corretor Digital</p>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap">
                {Object.entries(statusCounts).map(([key, count]) => (
                    <button key={key}
                        onClick={() => setFilterStatus(key === 'all' ? '' : key)}
                        className={cn('px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
                            (key === 'all' ? !filterStatus : filterStatus === key)
                                ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                                : 'border-[rgb(var(--border))] text-slate-400 hover:text-white')}>
                        {key === 'all' ? 'Todos' : key} ({count})
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por nome, telefone..." className="input pl-9" />
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[rgb(var(--border))]">
                                {['Lead', 'Telefone', 'Orçamento', 'Bairro', 'Status', 'Msgs', 'Último contato', ''].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgb(var(--border))]">
                            {loading && [1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="animate-pulse">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(j => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="h-3 bg-[rgb(var(--surface-2))] rounded w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center">
                                        <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                                        <p className="text-slate-500">Nenhum lead encontrado</p>
                                    </td>
                                </tr>
                            )}
                            {filtered.map(lead => (
                                <tr key={lead.id} className="hover:bg-[rgb(var(--surface-2))] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs">
                                                {(lead.name || lead.phone)[0].toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium">{lead.name || '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1.5 text-slate-300">
                                            <Phone className="w-3 h-3 text-slate-500" />
                                            {formatPhone(lead.phone)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {lead.budget ? <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-slate-500" />{formatCurrency(lead.budget)}</span> : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {lead.neighborhood ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" />{lead.neighborhood}</span> : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select value={lead.status}
                                            onChange={e => updateStatus(lead.id, e.target.value as Lead['status'])}
                                            className={cn('badge cursor-pointer border-0 outline-none appearance-none bg-transparent font-medium', getStatusColor(lead.status))}>
                                            <option value="Frio">Frio</option>
                                            <option value="Quente">Quente</option>
                                            <option value="Agendou Visita">Agendou Visita</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400 text-center">{lead.messages_count}</td>
                                    <td className="px-4 py-3 text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {lead.last_contact ? timeAgo(lead.last_contact) : '—'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <a href={`/mensagens?phone=${lead.phone}`}
                                            className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors">
                                            Ver chat →
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
