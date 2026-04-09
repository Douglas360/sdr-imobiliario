import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = createAdminClient()

    // Busca todos os tenants com detalhes usando o cliente admin para bypassar RLS
    const { data: tenants, error } = await admin
        .from('tenants')
        .select('*')
        .order('name')

    if (error) {
        return NextResponse.json({ error: 'Failed to load tenants' }, { status: 500 })
    }

    return NextResponse.json({ tenants })
}

export async function POST(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, evolution_instance, admin_email, admin_password, admin_name } = body

    if (!name) {
        return NextResponse.json({ error: 'O nome da imobiliária é obrigatório.' }, { status: 400 })
    }

    const admin = createAdminClient()
    
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

    // 1. Cria a imobiliária (Tenant)
    const { data: tenant, error: tenantError } = await admin
        .from('tenants')
        .insert({ 
            name, 
            slug,
            evolution_instance: evolution_instance || slug,
            whatsapp_connected: false 
        })
        .select()
        .single()

    if (tenantError) {
        return NextResponse.json({ error: tenantError.message }, { status: 500 })
    }

    // 2. Se informou dados de administrador, cria o usuário
    if (admin_email && admin_password) {
        const { data: authUser, error: authError } = await admin.auth.admin.createUser({
            email: admin_email,
            password: admin_password,
            email_confirm: true,
        })

        if (authError) {
            // Se falhou ao criar usuário, deleta o tenant (rollback manual simplificado)
            await admin.from('tenants').delete().eq('id', tenant.id)
            return NextResponse.json({ error: `Erro ao criar admin: ${authError.message}` }, { status: 500 })
        }

        const { error: profileError } = await admin.from('profiles').insert({
            id: authUser.user.id,
            full_name: admin_name || name,
            role: 'viewer', // 'user' foi rejeitado pela constraint do banco, usando o padrão permitido
            tenant_id: tenant.id
        })

        if (profileError) {
            // Rollback
            await admin.auth.admin.deleteUser(authUser.user.id)
            await admin.from('tenants').delete().eq('id', tenant.id)
            return NextResponse.json({ error: `Erro ao criar perfil admin: ${profileError.message}` }, { status: 500 })
        }
    }

    return NextResponse.json({ success: true, tenant })
}

export async function PATCH(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { id, name, evolution_instance } = body

    if (!id) return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 })

    const updates: any = { name, evolution_instance }
    if (name) updates.slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

    const admin = createAdminClient()
    const { data, error } = await admin
        .from('tenants')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, tenant: data })
}

export async function DELETE(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 })

    const admin = createAdminClient()
    const { error } = await admin
        .from('tenants')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
