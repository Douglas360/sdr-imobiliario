import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single()

    if (profileError || !profile?.tenant_id) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 400 })
    }

    const leadId = params.id
    if (!leadId) {
        return NextResponse.json({ error: 'Lead inválido' }, { status: 400 })
    }

    const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('id, phone')
        .eq('id', leadId)
        .eq('tenant_id', profile.tenant_id)
        .single()

    if (leadError || !lead) {
        return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
    }

    const { error: deleteMessagesError } = await supabase
        .from('messages')
        .delete()
        .eq('tenant_id', profile.tenant_id)
        .eq('phone', lead.phone)

    if (deleteMessagesError) {
        console.error('[Lead Delete Messages]', deleteMessagesError)
        return NextResponse.json({ error: deleteMessagesError.message }, { status: 500 })
    }

    const { error: deleteLeadError } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)
        .eq('tenant_id', profile.tenant_id)

    if (deleteLeadError) {
        console.error('[Lead Delete]', deleteLeadError)
        return NextResponse.json({ error: deleteLeadError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
