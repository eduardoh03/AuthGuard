"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, Key, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { mockUser } from "@/lib/mock-data"

export function AccountOverview() {
  const [userData, setUserData] = useState<any>(null)
  const [tokenInfo, setTokenInfo] = useState({
    accessTokenExpiry: "",
    refreshTokenExpiry: "",
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("mockUser")
    if (storedUser) {
      setUserData(JSON.parse(storedUser))
    } else {
      setUserData(mockUser)
    }

    const token = localStorage.getItem("accessToken")
    if (token) {
      // Parse JWT to get expiry (simplified)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        const accessExpiry = new Date(payload.exp * 1000)
        setTokenInfo({
          accessTokenExpiry: accessExpiry.toLocaleString("pt-BR"),
          refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString("pt-BR"),
        })
      } catch (e) {
        console.error("Failed to parse token:", e)
      }
    }
  }, [])

  const stats = [
    {
      title: "Status da Conta",
      value: "Ativa",
      icon: Shield,
      description: "Sua conta está ativa e protegida",
      color: "text-accent",
    },
    {
      title: "Access Token",
      value: "15 min",
      icon: Clock,
      description: "Tempo de expiração padrão",
      color: "text-primary",
    },
    {
      title: "Refresh Token",
      value: "7 dias",
      icon: Key,
      description: "Renovação automática ativa",
      color: "text-accent",
    },
    {
      title: "Tentativas Falhas",
      value: "0 / 5",
      icon: AlertCircle,
      description: "Proteção contra força bruta",
      color: "text-muted-foreground",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>Detalhes do seu perfil de usuário</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuário</p>
              <p className="text-lg font-semibold">{userData?.username || "demo_user"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg font-semibold">{userData?.email || "demo@authguard.com"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID do Usuário</p>
              <p className="text-sm font-mono">{userData?.id || "usr_123456789"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Criado em</p>
              <p className="text-sm">
                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString("pt-BR") : "15/01/2024"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {tokenInfo.accessTokenExpiry && (
        <Card>
          <CardHeader>
            <CardTitle>Informações de Token</CardTitle>
            <CardDescription>Dados sobre seus tokens de autenticação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <p className="text-sm font-medium">Access Token expira em</p>
                <p className="text-xs text-muted-foreground mt-1">{tokenInfo.accessTokenExpiry}</p>
              </div>
              <Badge variant="secondary">Ativo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <p className="text-sm font-medium">Refresh Token expira em</p>
                <p className="text-xs text-muted-foreground mt-1">{tokenInfo.refreshTokenExpiry}</p>
              </div>
              <Badge variant="secondary">Ativo</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
