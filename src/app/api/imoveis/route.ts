import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles').select('tenant_id').eq('id', user.id).single()

    if (!profile?.tenant_id) return NextResponse.json({ imoveis: [] })

    const { searchParams } = new URL(req.url)
    const bairro = searchParams.get('bairro')
    const quartos = searchParams.get('quartos')
    const search = searchParams.get('search')

    let query = supabase
        .from('imoveis')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .eq('disponivel', true)
        .order('valor', { ascending: true })
        .limit(200)

    if (bairro) query = query.eq('bairro', bairro)
    if (quartos) query = query.eq('quartos', parseInt(quartos))
    if (search) query = query.or(`titulo.ilike.%${search}%,bairro.ilike.%${search}%,descricao.ilike.%${search}%`)

    const { data: imoveis, error } = await query

    if (error) {
        console.error('[Imoveis]', error)
        return NextResponse.json({ imoveis: [], error: error.message }, { status: 500 })
    }

    // Mapeia campos snake_case do Supabase para o formato que o frontend espera
    const mapped = (imoveis || []).map(i => ({
        ID_Imovel: i.id_imovel,
        Titulo: i.titulo,
        Bairro: i.bairro || '',
        Valor: i.valor || 0,
        Quartos: i.quartos || 0,
        Vagas: i.vagas || 0,
        Area: i.area || 0,
        Link_Site: i.link_site || '',
        Descricao: i.descricao || '',
        Tem_Piscina: i.tem_piscina,
        Tem_Portaria: i.tem_portaria,
        Aceita_Pet: i.aceita_pet,
        Tem_Academia: i.tem_academia,
        Tem_Lazer: i.tem_lazer,
        Disponivel: i.disponivel,
    }))

    return NextResponse.json({ imoveis: mapped })
}

export async function DELETE(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles').select('tenant_id').eq('id', user.id).single()

    if (!profile?.tenant_id) return NextResponse.json({ error: 'No tenant found' }, { status: 400 })

    const { error } = await supabase
        .from('imoveis')
        .delete()
        .eq('tenant_id', profile.tenant_id)

    if (error) {
        console.error('[Imoveis Delete All]', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
