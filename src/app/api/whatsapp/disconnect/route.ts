import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles').select('tenant_id, tenant:tenants(evolution_instance, id)').eq('id', user.id).single()

    const tenantData = Array.isArray(profile?.tenant) ? profile.tenant[0] : profile?.tenant
    const tenant = tenantData as { evolution_instance: string; id: string } | null

    if (!tenant?.evolution_instance) return NextResponse.json({ error: 'Não configurado' }, { status: 400 })

    try {
        await fetch(
            `${process.env.EVOLUTION_API_URL}/instance/logout/${tenant.evolution_instance}`,
            { method: 'DELETE', headers: { apikey: process.env.EVOLUTION_API_KEY! } }
        )
        await supabase.from('tenants').update({ whatsapp_connected: false, whatsapp_phone: null }).eq('id', tenant.id)
        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ error: 'Falha ao desconectar' }, { status: 500 })
    }
}
