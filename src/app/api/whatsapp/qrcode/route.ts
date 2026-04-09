import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function getTenant() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile } = await supabase
        .from('profiles').select('tenant_id, tenant:tenants(evolution_instance)').eq('id', user.id).single()
    return profile?.tenant as unknown as { evolution_instance: string } | null
}

async function createInstance(instanceName: string, apiUrl: string, apiKey: string) {
    console.log('[QRCode] Criando instância:', instanceName)
    const res = await fetch(`${apiUrl}/instance/create`, {
        method: 'POST',
        headers: { apikey: apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            instanceName,
            token: `${instanceName}-token`,
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS'
        })
    })

    if (res.ok) {
        // Se a url do n8n estiver configurada, já seta o webhook da instância
        const n8nUrl = process.env.N8N_WEBHOOK_URL
        if (n8nUrl) {
            await fetch(`${apiUrl}/webhook/set/${instanceName}`, {
                method: 'POST',
                headers: { apikey: apiKey, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enabled: true,
                    url: n8nUrl,
                    webhookByEvents: false,
                    events: ["MESSAGES_UPSERT"]
                })
            }).catch(err => console.error('[QRCode] Erro ao setar webhook:', err))
        }
    }

    console.log('[QRCode] create status:', res.status)
    return res.ok
}

export async function GET() {
    const tenant = await getTenant()
    if (!tenant?.evolution_instance) {
        return NextResponse.json({ error: 'Instância não configurada no tenant' }, { status: 400 })
    }

    const apiUrl = process.env.EVOLUTION_API_URL!
    const apiKey = process.env.EVOLUTION_API_KEY!

    if (!apiUrl || !apiKey) {
        return NextResponse.json({ error: 'EVOLUTION_API_URL ou EVOLUTION_API_KEY não configurados' }, { status: 500 })
    }

    const instanceName = tenant.evolution_instance

    async function fetchConnect(): Promise<Response> {
        return fetch(`${apiUrl}/instance/connect/${instanceName}`, {
            headers: { apikey: apiKey },
            cache: 'no-store'
        })
    }

    try {
        let res = await fetchConnect()

        // Se a instância não existir, cria automaticamente e tenta de novo
        if (res.status === 404) {
            const created = await createInstance(instanceName, apiUrl, apiKey)
            if (!created) {
                return NextResponse.json({ error: 'Falha ao criar instância na Evolution API' }, { status: 502 })
            }
            // Aguarda um momento para a instância inicializar
            await new Promise(r => setTimeout(r, 1500))
            res = await fetchConnect()
        }

        const text = await res.text()
        console.log('[QRCode] HTTP Status:', res.status, '| Body:', text.substring(0, 300))

        if (!res.ok) {
            return NextResponse.json({ error: `Evolution API erro ${res.status}: ${text.substring(0, 150)}` }, { status: 502 })
        }

        let data: Record<string, unknown>
        try { data = JSON.parse(text) }
        catch { return NextResponse.json({ error: 'Resposta inválida da Evolution API' }, { status: 502 }) }

        // Estado conectado
        const instance = data.instance as Record<string, unknown> | undefined
        if (instance?.state === 'open' || data.state === 'open') {
            return NextResponse.json({ connected: true })
        }

        // QR Code em múltiplos campos (Evolution v1 e v2)
        const rawBase64 =
            (data.base64 as string) ||
            ((data.qrcode as Record<string, unknown>)?.base64 as string) ||
            (data.code as string) ||
            null

        if (rawBase64) {
            const qrcode = rawBase64.startsWith('data:') ? rawBase64 : `data:image/png;base64,${rawBase64}`
            return NextResponse.json({ qrcode, connected: false })
        }

        return NextResponse.json({
            error: 'QR Code não encontrado na resposta da Evolution API'
        }, { status: 502 })

    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('[QRCode] Erro:', msg)
        return NextResponse.json({ error: `Erro ao conectar na Evolution API: ${msg}` }, { status: 500 })
    }
}
