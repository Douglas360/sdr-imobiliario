import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    return (
        // Cancela o padding do DashboardLayout (p-6 md:p-8) e expande para full-height
        <div className="-m-6 md:-m-8 flex flex-1 min-h-0 h-screen">
            <AdminSidebar />
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {children}
            </div>
        </div>
    )
}
