import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UserManagement } from "@/components/dashboard/user-management"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Dashboard Administrativo</h1>
          <p className="text-muted-foreground mt-2">Gerencie usuários e visualize estatísticas do sistema</p>
        </div>
        <UserManagement />
      </div>
    </DashboardLayout>
  )
}
