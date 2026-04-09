import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
    _req: Request,
    { params }: { params: { phone: string } }
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

    const phone = decodeURIComponent(params.phone || '')
    if (!phone) {
        return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 })
    }

    const { data: deletedMessages, error: deleteMessagesError } = await supabase
        .from('messages')
        .delete()
        .eq('tenant_id', profile.tenant_id)
        .eq('phone', phone)
        .select('id')

    if (deleteMessagesError) {
        console.error('[Conversation Delete]', deleteMessagesError)
        return NextResponse.json({ error: deleteMessagesError.message }, { status: 500 })
    }

    const { error: updateLeadError } = await supabase
        .from('leads')
        .update({
            messages_count: 0,
            last_contact: null,
        })
        .eq('tenant_id', profile.tenant_id)
        .eq('phone', phone)

    if (updateLeadError) {
        console.error('[Conversation Sync Lead]', updateLeadError)
        return NextResponse.json({ error: updateLeadError.message }, { status: 500 })
    }

    return NextResponse.json({
        success: true,
        deleted: deletedMessages?.length || 0,
    })
}
