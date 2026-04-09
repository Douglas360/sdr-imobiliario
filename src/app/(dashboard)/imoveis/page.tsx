'use client'
import { useState, useEffect, useRef } from 'react'
import { Imovel } from '@/types'
import { formatCurrency } from '@/lib/utils'
import {
    Building2, Search, ExternalLink, BedDouble, Car,
    Dog, Waves, RefreshCw, Trash2
} from 'lucide-react'

export default function ImoveisPage() {
    const [imoveis, setImoveis] = useState<Imovel[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterBairro, setFilterBairro] = useState('')
    const [filterQuartos, setFilterQuartos] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const handleClearCatalog = async () => {
        if (!confirm('Tem certeza que deseja excluir todos os imóveis do catálogo? Esta ação não pode ser desfeita.')) return
        
        setIsDeleting(true)
        try {
            const res = await fetch('/api/imoveis', { method: 'DELETE' })
            if (res.ok) {
                setImoveis([])
            } else {
                alert('Erro ao excluir imóveis')
            }
        } catch (error) {
            console.error(error)
            alert('Erro ao excluir imóveis')
        } finally {
            setIsDeleting(false)
        }
    }

    const loadImoveis = () => {
        setLoading(true)
        fetch('/api/imoveis').then(r => r.json()).then(data => {
            setImoveis(data.imoveis || [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }

    useEffect(() => { loadImoveis() }, [])

    const bairros = Array.from(new Set(imoveis.map(i => i.Bairro).filter(Boolean)))

    const filtered = imoveis.filter(i => {
        const q = search.toLowerCase()
        const matchSearch = !q || i.Titulo.toLowerCase().includes(q) || i.Bairro.toLowerCase().includes(q)
        const matchBairro = !filterBairro || i.Bairro === filterBairro
        const matchQuartos = !filterQuartos || i.Quartos === parseInt(filterQuartos)
        return matchSearch && matchBairro && matchQuartos
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Catálogo de Imóveis</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {loading ? 'Carregando...' : `${imoveis.length} imóveis no catálogo`}
                    </p>
                </div>
                {imoveis.length > 0 && (
                    <button 
                        onClick={handleClearCatalog} 
                        disabled={isDeleting}
                        className="btn bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="font-medium">{isDeleting ? 'Excluindo...' : 'Limpar Catálogo'}</span>
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por título ou bairro..." className="input pl-9" />
                </div>
                <select value={filterBairro} onChange={e => setFilterBairro(e.target.value)} className="input w-auto">
                    <option value="">Todos os bairros</option>
                    {bairros.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select value={filterQuartos} onChange={e => setFilterQuartos(e.target.value)} className="input w-auto">
                    <option value="">Quartos</option>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} quarto{n > 1 ? 's' : ''}</option>)}
                </select>
                {(search || filterBairro || filterQuartos) && (
                    <button onClick={() => { setSearch(''); setFilterBairro(''); setFilterQuartos('') }}
                        className="btn-secondary text-sm">Limpar</button>
                )}
                <button onClick={loadImoveis} className="text-slate-500 hover:text-white transition-colors" title="Atualizar">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Skeleton */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="card p-5 animate-pulse space-y-3">
                            <div className="h-4 bg-[rgb(var(--surface-2))] rounded w-3/4" />
                            <div className="h-3 bg-[rgb(var(--surface-2))] rounded w-1/2" />
                            <div className="h-6 bg-[rgb(var(--surface-2))] rounded w-1/3" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
                <div className="card p-12 text-center flex flex-col items-center justify-center">
                    <img 
                        src="/logo.png" 
                        alt="SDR Logo" 
                        className="w-16 h-16 mx-auto mb-3 opacity-20 grayscale"
                        style={{ mixBlendMode: 'screen' }}
                    />
                    <p className="text-slate-400 font-medium">
                        {imoveis.length === 0 ? 'Nenhum imóvel no catálogo' : 'Nenhum imóvel encontrado com esses filtros'}
                    </p>
                </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(imovel => (
                    <div key={imovel.ID_Imovel} className="card p-5 hover:border-brand-500/40 transition-all group">
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm leading-tight truncate">{imovel.Titulo}</p>
                                <p className="text-slate-400 text-xs mt-0.5">📍 {imovel.Bairro || 'Sem bairro'}</p>
                            </div>
                            {imovel.Link_Site && (
                                <a href={imovel.Link_Site} target="_blank" rel="noreferrer"
                                    className="text-slate-500 hover:text-brand-400 transition-colors flex-shrink-0">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        <p className="text-2xl font-bold text-brand-400 mb-4">
                            {imovel.Valor ? formatCurrency(imovel.Valor) : 'Consulte'}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                            {imovel.Quartos > 0 && <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{imovel.Quartos}Q</span>}
                            {imovel.Vagas > 0 && <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" />{imovel.Vagas}V</span>}
                            {imovel.Aceita_Pet && <span className="flex items-center gap-1 text-green-400"><Dog className="w-3.5 h-3.5" />Pet OK</span>}
                            {imovel.Tem_Piscina && <span className="flex items-center gap-1 text-blue-400"><Waves className="w-3.5 h-3.5" />Piscina</span>}
                        </div>

                        {imovel.Descricao && (
                            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{imovel.Descricao}</p>
                        )}

                        <div className="flex gap-1.5 mt-3 flex-wrap">
                            {imovel.Tem_Portaria && <span className="badge bg-slate-700 text-slate-300">🔒 Portaria 24h</span>}
                            {imovel.Tem_Academia && <span className="badge bg-slate-700 text-slate-300">💪 Academia</span>}
                            {imovel.Tem_Lazer && <span className="badge bg-slate-700 text-slate-300">🎉 Lazer</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
