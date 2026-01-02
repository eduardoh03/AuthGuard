"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UserManagement } from "@/components/dashboard/user-management"
import { HomePage } from "@/components/dashboard/home-page"
import { api } from "@/lib/api"

export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsAdmin(api.isAdmin())
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {isAdmin ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Dashboard Administrativo</h1>
            <p className="text-muted-foreground mt-2">Gerencie usuários e visualize estatísticas do sistema</p>
          </div>
          <UserManagement />
        </div>
      ) : (
        <HomePage />
      )}
    </DashboardLayout>
  )
}

