// Tipos globais para a plataforma SDR Imobiliário

export interface Tenant {
    id: string
    name: string
    slug: string
    evolution_instance: string | null
    airtable_base_id: string | null
    airtable_api_key: string | null
    whatsapp_connected: boolean
    whatsapp_phone: string | null
    plan: 'trial' | 'basic' | 'pro'
    created_at: string
}

export interface Profile {
    id: string
    tenant_id: string
    role: 'admin' | 'viewer'
    full_name: string | null
    tenant?: Tenant
}

export interface Message {
    id: string
    tenant_id: string
    phone: string
    lead_name: string | null
    direction: 'in' | 'out'
    content: string
    status: 'sent' | 'delivered' | 'read'
    created_at: string
}

export interface Lead {
    id: string
    tenant_id: string
    phone: string
    name: string | null
    budget: number | null
    neighborhood: string | null
    status: 'Frio' | 'Quente' | 'Agendou Visita'
    messages_count: number
    last_contact: string | null
    created_at: string
}

export interface Imovel {
    ID_Imovel: string
    Titulo: string
    Bairro: string
    Valor: number
    Quartos: number
    Vagas: number
    Link_Site: string
    Descricao: string
    Tem_Piscina: boolean
    Tem_Portaria: boolean
    Aceita_Pet: boolean
    Tem_Academia: boolean
    Tem_Lazer: boolean
    Disponivel: boolean
    Fotos?: string[]
}

export interface Conversation {
    phone: string
    lead_name: string | null
    lead_status: Lead['status'] | null
    last_message: string
    last_message_at: string
    unread_count: number
    messages: Message[]
}
