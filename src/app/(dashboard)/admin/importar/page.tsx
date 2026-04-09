'use client'
import { useState, useRef, useEffect } from 'react'
import { Upload, FileJson, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'

type ImportPhase = 'idle' | 'uploading' | 'success' | 'error'

export default function AdminImportarPage() {
    const [phase, setPhase] = useState<ImportPhase>('idle')
    const [tenantId, setTenantId] = useState('')
    const [jsonInput, setJsonInput] = useState('')

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [tenants, setTenants] = useState<{ id: string, name: string }[]>([])
    const [loadingTenants, setLoadingTenants] = useState(true)

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        async function fetchTenants() {
            try {
                const res = await fetch('/api/admin/tenants')
                const data = await res.json()
                if (data.tenants) {
                    setTenants(data.tenants)
                }
            } catch (e) {
                console.error('Falha ao carregar tenants', e)
            } finally {
                setLoadingTenants(false)
            }
        }
        fetchTenants()
    }, [])

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            const content = e.target?.result as string
            setJsonInput(content)
        }
        reader.readAsText(file)
    }

    const startImport = async () => {
        if (!tenantId.trim()) {
            setErrorMessage('Por favor, insira o ID do Tenant de destino.')
            setPhase('error')
            return
        }
        if (!jsonInput.trim()) {
            setErrorMessage('O conteúdo do JSON está vazio.')
            setPhase('error')
            return
        }

        let parsedData = []
        try {
            parsedData = JSON.parse(jsonInput)
            if (!Array.isArray(parsedData)) {
                // Se for objeto individual mas for só 1, coloca em array
                parsedData = [parsedData]
            }
        } catch (e) {
            setErrorMessage('JSON inválido. Verifique a formatação do texto ou arquivo.')
            setPhase('error')
            return
        }

        if (parsedData.length === 0) {
            setErrorMessage('O JSON processado não contém imóveis.')
            setPhase('error')
            return
        }

        setPhase('uploading')
        setErrorMessage('')
        setSuccessMessage('')

        try {
            const res = await fetch('/api/admin/imoveis/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenant_id: tenantId.trim(),
                    imoveis: parsedData
                })
            })

            const data = await res.json()

            if (!res.ok || data.error) {
                setErrorMessage(data.error || 'Ocorreu um erro no servidor.')
                setPhase('error')
                return
            }

            setSuccessMessage(data.message || 'Importação realizada com sucesso!')
            setPhase('success')

        } catch (error: any) {
            setErrorMessage(error.message || 'Falha na conexão ao importar.')
            setPhase('error')
        }
    }

    const reset = () => {
        setPhase('idle')
        setErrorMessage('')
        setSuccessMessage('')
        setJsonInput('') // Remove texto pra próxima
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-brand-400" />
                    </div>
                    Importação Administrativa em Lote (JSON)
                </h1>
                <p className="text-slate-400 text-sm mt-2 ml-14">
                    Importe imóveis fornecendo o ID do Tenant e os dados em JSON.
                </p>
            </div>

            <div className="card p-6">

                {/* Form State */}
                {phase === 'idle' && (
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Selecione o Cliente (Tenant) de Destino <span className="text-red-400">*</span></label>
                            <select
                                value={tenantId}
                                onChange={e => setTenantId(e.target.value)}
                                className="input w-full"
                                disabled={loadingTenants}
                            >
                                <option value="">{loadingTenants ? 'Carregando clientes...' : 'Selecione um cliente'}</option>
                                {tenants.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300">Lista de Imóveis (JSON Array) <span className="text-red-400">*</span></label>

                                <div>
                                    <input
                                        type="file"
                                        accept=".json"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors bg-[rgb(var(--surface-2))] px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-700"
                                    >
                                        <FileJson className="w-3.5 h-3.5" /> Fazer Upload de Arquivo .json
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder={'[\n  {\n    "titulo": "Casa Luxuosa",\n    "valor": 1500000,\n    "quartos": 4,\n    "link_site": "https://meusite.com/imoveis/1"\n  }\n]'}
                                className="input w-full font-mono text-sm h-64 resize-y"
                            />
                            <p className="text-xs text-slate-500">
                                Dica: Pelo menos as propriedades obrigatórias devem estar presentes (Titulo). A importação suporta camelCase ou snake_case.
                            </p>
                        </div>

                        <button
                            onClick={startImport}
                            disabled={!tenantId.trim() || !jsonInput.trim()}
                            className="btn-primary w-full justify-center flex items-center gap-2 py-3 disabled:opacity-50"
                        >
                            <Upload className="w-4 h-4" /> Importar Imóveis
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {phase === 'uploading' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
                        <h3 className="text-white font-medium text-lg">Processando e Inserindo Dados...</h3>
                        <p className="text-slate-400 text-sm">Validando o JSON e enviando para o banco de dados do Supabase. Aguarde.</p>
                    </div>
                )}

                {/* Error State */}
                {phase === 'error' && (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-5">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <div className="max-w-md">
                            <h3 className="text-white font-medium text-lg mb-1">Falha na Importação</h3>
                            <p className="text-slate-400 text-sm whitespace-pre-wrap">{errorMessage}</p>
                        </div>
                        <button onClick={() => setPhase('idle')} className="btn-secondary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" /> Corrigir e Tentar Novamente
                        </button>
                    </div>
                )}

                {/* Success State */}
                {phase === 'success' && (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-5">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-400" />
                        </div>
                        <div className="max-w-md">
                            <h3 className="text-white font-medium text-lg mb-1">Upload Concluído!</h3>
                            <p className="text-slate-400 text-sm">{successMessage}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={reset} className="btn-secondary flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" /> Importar Novos
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
