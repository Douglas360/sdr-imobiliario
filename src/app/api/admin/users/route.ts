import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET /api/admin/users — Lista todos os usuários com perfil e tenant
export async function GET() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = createAdminClient()

    // Busca todos os profiles com tenant vinculado
    const { data: profiles, error } = await admin
        .from('profiles')
        .select('id, full_name, role, tenant_id, tenant:tenants(id, name)')
        .order('full_name')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Busca auth.users para pegar email e status
    const { data: authUsers, error: authError } = await admin.auth.admin.listUsers()
    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Faz o merge: perfil + email + ban_duration
    const users = (profiles || []).map((profile: any) => {
        const authUser = authUsers.users.find((u) => u.id === profile.id)
        return {
            id: profile.id,
            name: profile.full_name || '',
            role: profile.role || 'viewer',
            tenant_id: profile.tenant_id,
            tenant: profile.tenant,
            email: authUser?.email || '',
            banned: !!authUser?.banned_until,
            email_confirmed: !!authUser?.email_confirmed_at,
            last_sign_in: authUser?.last_sign_in_at || null,
            created_at: authUser?.created_at || null,
        }
    })

    return NextResponse.json({ users })
}

// POST /api/admin/users — Cria novo usuário e profile
export async function POST(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { email, password, name, role, tenant_id } = body

    if (!email || !password || !tenant_id) {
        return NextResponse.json(
            { error: 'email, password e tenant_id são obrigatórios.' },
            { status: 400 }
        )
    }

    const admin = createAdminClient()

    // Cria o usuário no Supabase Auth
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    })

    if (createError || !newUser.user) {
        return NextResponse.json({ error: createError?.message || 'Falha ao criar usuário' }, { status: 500 })
    }

    // Cria o profile vinculado ao tenant
    const { error: profileError } = await admin.from('profiles').insert({
        id: newUser.user.id,
        full_name: name || '',
        role: role || 'viewer',
        tenant_id,
    })

    if (profileError) {
        // Rollback: remove o usuário do auth se o profile falhar
        await admin.auth.admin.deleteUser(newUser.user.id)
        return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user_id: newUser.user.id })
}
