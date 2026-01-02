import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SecuritySettings } from "@/components/dashboard/security-settings"

export default function SecurityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Segurança</h1>
          <p className="text-muted-foreground mt-2">Atualize sua senha e gerencie suas configurações de segurança</p>
        </div>
        <SecuritySettings />
      </div>
    </DashboardLayout>
  )
}
