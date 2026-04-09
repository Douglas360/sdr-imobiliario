'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn, formatPhone, timeAgo, getStatusColor } from '@/lib/utils'
import { Message, Conversation, Lead } from '@/types'
import { MessageSquare, Search } from 'lucide-react'

export default function MensagensPage() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selected, setSelected] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        loadConversations()
        // Realtime subscription
        const channel = supabase
            .channel('messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => loadConversations())
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [selected, conversations])

    async function loadConversations() {
        const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(500)

        const { data: leads } = await supabase
            .from('leads')
            .select('phone, name, status')

        if (!messages) return

        const byPhone: Record<string, Message[]> = {}
        messages.forEach(m => {
            if (!byPhone[m.phone]) byPhone[m.phone] = []
            byPhone[m.phone].push(m)
        })

        const convs: Conversation[] = Object.entries(byPhone)
            .map(([phone, msgs]) => {
                const lead = leads?.find((l: any) => l.phone === phone)
                const last = msgs[msgs.length - 1]
                return {
                    phone,
                    lead_name: lead?.name || msgs[0]?.lead_name || null,
                    lead_status: lead?.status || null,
                    last_message: last.content,
                    last_message_at: last.created_at,
                    unread_count: 0,
                    messages: msgs,
                }
            })
            .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())

        setConversations(convs)
        if (!selected && convs.length > 0) setSelected(convs[0].phone)
    }

    const filtered = conversations.filter(c =>
        (c.lead_name?.toLowerCase().includes(search.toLowerCase()) || false) ||
        c.phone.includes(search)
    )
    const activeConv = conversations.find(c => c.phone === selected)

    return (
        <div className="h-[calc(100vh-7rem)] flex gap-4">
            {/* Conversation List */}
            <div className="w-80 flex flex-col card overflow-hidden">
                <div className="p-4 border-b border-[rgb(var(--border))]">
                    <h2 className="text-white font-semibold mb-3">Conversas</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar..." className="input pl-9 text-sm py-1.5" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-32 text-slate-500 text-sm gap-2">
                            <MessageSquare className="w-6 h-6" />
                            <p>Nenhuma conversa ainda</p>
                        </div>
                    )}
                    {filtered.map(conv => (
                        <button key={conv.phone} onClick={() => setSelected(conv.phone)}
                            className={cn('w-full text-left px-4 py-3 border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--surface-2))] transition-colors',
                                selected === conv.phone ? 'bg-brand-500/10 border-l-2 border-l-brand-500' : '')}>
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-[rgb(var(--surface-2))] flex items-center justify-center flex-shrink-0 text-sm font-bold text-brand-400">
                                        {(conv.lead_name || conv.phone)[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-sm font-medium truncate">
                                            {conv.lead_name || formatPhone(conv.phone)}
                                        </p>
                                        {conv.lead_name && <p className="text-slate-500 text-xs">{formatPhone(conv.phone)}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <span className="text-slate-500 text-xs">{timeAgo(conv.last_message_at)}</span>
                                    {conv.lead_status && (
                                        <span className={cn('badge text-xs', getStatusColor(conv.lead_status))}>
                                            {conv.lead_status}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-slate-500 text-xs mt-1.5 truncate pl-11">{conv.last_message}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col card overflow-hidden">
                {!activeConv ? (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        <div className="text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Selecione uma conversa</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-[rgb(var(--border))] flex items-center justify-between">
                            <div>
                                <p className="text-white font-semibold">{activeConv.lead_name || formatPhone(activeConv.phone)}</p>
                                <p className="text-slate-500 text-xs">{formatPhone(activeConv.phone)}</p>
                            </div>
                            {activeConv.lead_status && (
                                <span className={cn('badge', getStatusColor(activeConv.lead_status))}>
                                    {activeConv.lead_status}
                                </span>
                            )}
                        </div>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {activeConv.messages.map(msg => (
                                <div key={msg.id} className={cn('flex', msg.direction === 'out' ? 'justify-end' : 'justify-start')}>
                                    <div className={cn('max-w-[75%] px-4 py-2.5 rounded-2xl text-sm',
                                        msg.direction === 'out'
                                            ? 'bg-brand-500 text-white rounded-tr-sm'
                                            : 'bg-[rgb(var(--surface-2))] text-slate-200 rounded-tl-sm')}>
                                        <p className="leading-relaxed">{msg.content}</p>
                                        <p className={cn('text-xs mt-1', msg.direction === 'out' ? 'text-brand-200' : 'text-slate-500')}>
                                            {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
