import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

export async function POST(req: Request) {
    // Verifica secret para requests do n8n
    const secret = req.headers.get('x-webhook-secret')
    if (secret !== process.env.N8N_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { phone, message, direction, lead_name, tenant_instance, lead_status, lead_budget, lead_neighborhood } = body

    if (!phone || !message || !tenant_instance) {
        return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Encontra o tenant pela instância da Evolution
    const { data: tenant } = await supabase
        .from('tenants').select('id').eq('evolution_instance', tenant_instance).single()

    if (!tenant) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })

    const tenant_id = tenant.id

    // Salva mensagem
    await supabase.from('messages').insert({
        tenant_id, phone, content: message, direction: direction || 'in',
        lead_name: lead_name || null, status: direction === 'out' ? 'sent' : 'delivered'
    })

    // Upsert lead
    const { data: existingLead } = await supabase
        .from('leads').select('id, messages_count').eq('tenant_id', tenant_id).eq('phone', phone).single()

    if (existingLead) {
        const updateData: Record<string, unknown> = {
            messages_count: (existingLead.messages_count || 0) + 1,
            last_contact: new Date().toISOString()
        }
        if (lead_name) updateData.name = lead_name
        if (lead_status) updateData.status = lead_status
        if (lead_budget) updateData.budget = lead_budget
        if (lead_neighborhood) updateData.neighborhood = lead_neighborhood
        await supabase.from('leads').update(updateData).eq('id', existingLead.id)
    } else {
        await supabase.from('leads').insert({
            tenant_id, phone, name: lead_name || null,
            status: lead_status || 'Frio', messages_count: 1,
            budget: lead_budget || null, neighborhood: lead_neighborhood || null,
            last_contact: new Date().toISOString()
        })
    }

    return NextResponse.json({ ok: true })
}
