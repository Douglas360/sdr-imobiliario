import { createClient } from '@/lib/supabase/server'
import { MessageSquare, Users, Building2, Smartphone, TrendingUp, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

async function getStats(tenantId: string) {
    const supabase = createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [{ count: msgToday }, { count: leadsTotal }, { count: leadsHot }, { data: tenant }] = await Promise.all([
        supabase.from('messages').select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId).gte('created_at', today.toISOString()),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
        supabase.from('leads').select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId).eq('status', 'Quente'),
        supabase.from('tenants').select('whatsapp_connected, name').eq('id', tenantId).single(),
    ])

    return { msgToday: msgToday || 0, leadsTotal: leadsTotal || 0, leadsHot: leadsHot || 0, tenant: tenant }
}

export default async function OverviewPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user!.id).single()

    const stats = await getStats(profile!.tenant_id)

    const cards = [
        { label: 'Mensagens Hoje', value: stats.msgToday, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Total de Leads', value: stats.leadsTotal, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Leads Quentes', value: stats.leadsHot, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { label: 'WhatsApp', value: stats.tenant?.whatsapp_connected ? 'Conectado' : 'Desconectado', icon: Smartphone, color: stats.tenant?.whatsapp_connected ? 'text-green-400' : 'text-red-400', bg: stats.tenant?.whatsapp_connected ? 'bg-green-400/10' : 'bg-red-400/10' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Visão Geral</h1>
                <p className="text-slate-400 text-sm mt-1">Acompanhe o desempenho do seu Corretor Digital</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="card p-5 hover:border-[rgb(var(--brand))/30] transition-colors">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
                                <p className={cn('text-3xl font-bold mt-2', color)}>{value}</p>
                            </div>
                            <div className={cn('p-2.5 rounded-lg', bg)}>
                                <Icon className={cn('w-5 h-5', color)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { href: '/whatsapp', label: 'Configurar WhatsApp', desc: 'Conecte o número da imobiliária', icon: Smartphone },
                    { href: '/mensagens', label: 'Ver Mensagens', desc: 'Inbox do WhatsApp em tempo real', icon: MessageSquare },
                    { href: '/leads', label: 'Gerenciar Leads', desc: 'Leads qualificados pelo bot', icon: Users },
                ].map(({ href, label, desc, icon: Icon }) => (
                    <a key={href} href={href}
                        className="card p-5 flex items-center justify-between hover:border-brand-500/40 hover:bg-brand-500/5 transition-all group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-brand-500/10">
                                <Icon className="w-4 h-4 text-brand-400" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">{label}</p>
                                <p className="text-slate-500 text-xs">{desc}</p>
                            </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors" />
                    </a>
                ))}
            </div>
        </div>
    )
}
