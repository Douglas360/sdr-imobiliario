'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard, MessageSquare, Building2, Users,
    Smartphone, LogOut, ChevronRight
} from 'lucide-react'

const navItems = [
    { href: '/', label: 'Visão Geral', icon: LayoutDashboard },
    { href: '/whatsapp', label: 'WhatsApp', icon: Smartphone },
    { href: '/mensagens', label: 'Mensagens', icon: MessageSquare },
    { href: '/imoveis', label: 'Imóveis', icon: Building2 },
    { href: '/leads', label: 'Leads', icon: Users },
]

export function Sidebar({ tenantName }: { tenantName: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <aside className="flex flex-col w-64 min-h-screen border-r border-[rgb(var(--border))]"
            style={{ background: 'rgba(13,17,27,0.95)' }}>

            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-[rgb(var(--border))]">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-black overflow-hidden border border-brand-500/30">
                    <img 
                        src="/logo.png" 
                        alt="SDR Logo" 
                        className="w-full h-full object-cover"
                        style={{ mixBlendMode: 'screen' }}
                    />
                </div>
                <div className="overflow-hidden">
                    <p className="text-white font-semibold text-sm leading-tight truncate">{tenantName}</p>
                    <p className="text-slate-500 text-xs">SDR Imobiliário</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
                    return (
                        <Link key={href} href={href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                                active
                                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                                    : 'text-slate-400 hover:bg-[rgb(var(--surface-2))] hover:text-white'
                            )}>
                            <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-brand-400' : 'text-slate-500 group-hover:text-white')} />
                            {label}
                            {active && <ChevronRight className="w-3 h-3 ml-auto text-brand-400" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-[rgb(var(--border))]">
                <button onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 w-full">
                    <LogOut className="w-4 h-4" />
                    Sair
                </button>
            </div>
        </aside>
    )
}
