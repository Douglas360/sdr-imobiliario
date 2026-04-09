import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Busca todos os tenants (considerando que admin tem acesso irrestrito na tabela)
    const { data: tenants, error } = await supabase
        .from('tenants')
        .select('id, name')
        .order('name')

    if (error) {
        return NextResponse.json({ error: 'Failed to load tenants' }, { status: 500 })
    }

    return NextResponse.json({ tenants })
}
