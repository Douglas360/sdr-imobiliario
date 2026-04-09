'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Upload, Users, Shield, Building2, ChevronLeft, ChevronRight } from 'lucide-react'

const adminNavItems = [
    { href: '/admin/usuarios', label: 'Usuários', icon: Users, description: 'Gerenciar corretores e acessos' },
    { href: '/admin/imobiliarias', label: 'Imobiliárias', icon: Building2, description: 'Gerenciar clientes e instâncias' },
    { href: '/admin/importar', label: 'Importar Imóveis', icon: Upload, description: 'Importação em lote via JSON' },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-56 shrink-0 border-r border-[rgb(var(--border))] flex flex-col"
            style={{ background: 'rgba(15,20,32,0.95)' }}>

            {/* Header */}
            <div className="px-4 py-4 border-b border-[rgb(var(--border))]">
                <div className="flex items-center gap-2 mb-3">
                    <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs transition-colors">
                        <ChevronLeft className="w-3 h-3" />
                        Voltar ao painel
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                        <p className="text-white text-xs font-semibold">Admin</p>
                        <p className="text-slate-500 text-[10px]">Painel de administração</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-3 space-y-0.5">
                {adminNavItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + '/')
                    return (
                        <Link key={href} href={href}
                            className={cn(
                                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                                active
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                    : 'text-slate-400 hover:bg-[rgb(var(--surface-2))] hover:text-white'
                            )}>
                            <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-amber-400' : 'text-slate-500 group-hover:text-white')} />
                            {label}
                            {active && <ChevronRight className="w-3 h-3 ml-auto text-amber-400" />}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
