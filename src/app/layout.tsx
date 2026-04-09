import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'SDR Imobiliário | Corretor Digital 24/7',
    description: 'Plataforma de automação de vendas imobiliárias via WhatsApp',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/logo.png',
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    )
}
