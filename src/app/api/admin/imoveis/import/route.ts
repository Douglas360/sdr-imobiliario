import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = createClient()

        // Autenticação básica
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Parse do JSON recebido
        const body = await req.json()
        const { tenant_id, imoveis } = body

        if (!tenant_id || !imoveis || !Array.isArray(imoveis)) {
            return NextResponse.json(
                { error: 'Payload inválido. Certifique-se de enviar tenant_id e um array de imoveis.' },
                { status: 400 }
            )
        }

        if (imoveis.length === 0) {
            return NextResponse.json({ error: 'O array de imóveis está vazio.' }, { status: 400 })
        }

        // Mapear os imóveis para as colunas do banco do Supabase
        const imoveisData = imoveis.map((imovel: any) => {
            // Aceitar propriedades vindas de diferentes formatações (ex: snake_case, PascalCase, ou camelCase)
            const titulo = imovel.Titulo || imovel.titulo || 'Sem Título'
            const valor = imovel.Valor || imovel.valor || 0
            const quartos = imovel.Quartos || imovel.quartos || 0
            const vagas = imovel.Vagas || imovel.vagas || 0
            const bairro = imovel.Bairro || imovel.bairro || 'Sem Bairro'
            const area = imovel.Area || imovel.area || 0
            const descricao = imovel.Descricao || imovel.descricao || ''
            const link_site = imovel.Link_Site || imovel.link_site || imovel.linkSite || imovel.link || ''
            const id_imovel = imovel.ID_Imovel || imovel.id_imovel || imovel.idImobiliaria || `IMP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

            // Valores Booleanos robustos (aceita boolean ou strings sim/não/s/n)
            const booleanOrFalse = (val: any) => {
                if (typeof val === 'boolean') return val
                if (typeof val === 'string') {
                    const normalized = val.toLowerCase().trim()
                    return ['sim', 's', 'true', '1', 'yes'].includes(normalized)
                }
                return false
            }

            return {
                tenant_id,
                id_imovel,
                titulo,
                valor,
                quartos,
                vagas,
                bairro,
                area,
                descricao,
                link_site,
                tem_piscina: booleanOrFalse(imovel.Tem_Piscina || imovel.tem_piscina),
                tem_portaria: booleanOrFalse(imovel.Tem_Portaria || imovel.tem_portaria),
                aceita_pet: booleanOrFalse(imovel.Aceita_Pet || imovel.aceita_pet),
                tem_academia: booleanOrFalse(imovel.Tem_Academia || imovel.tem_academia),
                tem_lazer: booleanOrFalse(imovel.Tem_Lazer || imovel.tem_lazer),
                disponivel: typeof (imovel.Disponivel || imovel.disponivel) === 'boolean'
                    ? (imovel.Disponivel || imovel.disponivel)
                    : true // Default true se omitido
            }
        })

        // Inserir todos no Supabase
        const { data, error } = await supabase
            .from('imoveis')
            .insert(imoveisData)
            .select()

        if (error) {
            console.error('[Admin Import Error]', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: `${imoveisData.length} imóveis importados com sucesso!`,
            importados: imoveisData.length
        })

    } catch (err) {
        console.error('[Error na Importação]', err)
        return NextResponse.json({ error: 'Erro interno no servidor ao processar a importação.' }, { status: 500 })
    }
}
