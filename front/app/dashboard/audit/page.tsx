import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AuditLogs } from "@/components/dashboard/audit-logs"

export default function AuditPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Logs de Auditoria</h1>
          <p className="text-muted-foreground mt-2">Visualize todas as atividades e eventos de autenticação</p>
        </div>
        <AuditLogs />
      </div>
    </DashboardLayout>
  )
}
