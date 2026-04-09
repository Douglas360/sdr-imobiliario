import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// PATCH /api/admin/users/[id] — Atualiza nome, role, ou ban/unban
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, role, banned } = body
    const admin = createAdminClient()

    // Atualiza profile
    if (name !== undefined || role !== undefined) {
        const updates: Record<string, any> = {}
        if (name !== undefined) updates.full_name = name
        if (role !== undefined) updates.role = role

        const { error } = await admin
            .from('profiles')
            .update(updates)
            .eq('id', params.id)

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Ban ou unban no auth
    if (banned !== undefined) {
        const { error } = await admin.auth.admin.updateUserById(params.id, {
            ban_duration: banned ? '876600h' : 'none', // ~100 anos = banido permanente
        })
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

// DELETE /api/admin/users/[id] — Remove usuário permanentemente
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = createAdminClient()

    const { error } = await admin.auth.admin.deleteUser(params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}
