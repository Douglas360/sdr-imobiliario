import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function getTenant() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile } = await supabase
        .from('profiles').select('tenant_id, tenant:tenants(evolution_instance, whatsapp_connected)').eq('id', user.id).single()
    const tenantData = Array.isArray(profile?.tenant) ? profile.tenant[0] : profile?.tenant;
    return { 
        tenant_id: profile?.tenant_id,
        evolution_instance: tenantData?.evolution_instance,
        whatsapp_connected: tenantData?.whatsapp_connected 
    }
}

export async function GET() {
    const tenant = await getTenant()
    if (!tenant?.evolution_instance) return NextResponse.json({ connected: false })

    try {
        const res = await fetch(
            `${process.env.EVOLUTION_API_URL}/instance/connectionState/${tenant.evolution_instance}`,
            { headers: { apikey: process.env.EVOLUTION_API_KEY! }, cache: 'no-store' }
        )
        const data = await res.json()
        const connected = data.instance?.state === 'open'
        
        // Update DB if state changed
        if (tenant.tenant_id && tenant.whatsapp_connected !== connected) {
            const supabase = createClient()
            await supabase
                .from('tenants')
                .update({ whatsapp_connected: connected })
                .eq('id', tenant.tenant_id)
        }
        
        const phone = data.instance?.profileJid?.replace('@s.whatsapp.net', '')
        const profileName = data.instance?.profileName
        return NextResponse.json({ connected, phone, profileName })
    } catch {
        return NextResponse.json({ connected: false, error: 'Falha ao conectar com Evolution API' })
    }
}
