"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  LogIn,
  LogOut,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Search,
  User,
  Eye,
  List,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react"
import { api, type AuditLogResponse, type ApiError } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const getEventIcon = (action: string) => {
  switch (action) {
    case "LOGIN":
      return <LogIn className="h-4 w-4 text-green-600 dark:text-green-400" />
    case "LOGIN_FAILED":
      return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
    case "LOGOUT":
      return <LogOut className="h-4 w-4 text-orange-600 dark:text-orange-400" />
    case "VIEW_USER":
      return <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    case "LIST_USERS":
      return <List className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    case "CREATE_USER":
      return <User className="h-4 w-4 text-green-600 dark:text-green-400" />
    case "UPDATE_USER":
      return <Edit className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    case "DELETE_USER":
      return <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
    case "CHANGE_PASSWORD":
      return <Key className="h-4 w-4 text-purple-600 dark:text-purple-400" />
    case "CHANGE_ROLE":
      return <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
    default:
      return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
  }
}

const getStatusBadge = (action: string) => {
  if (action.includes("FAILED")) {
    return <Badge variant="destructive">Falha</Badge>
  }
  return (
    <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-400">
      Sucesso
    </Badge>
  )
}

const getEventLabel = (action: string) => {
  const labels: Record<string, string> = {
    LOGIN: "Login realizado",
    LOGIN_FAILED: "Tentativa de login falhou",
    LOGOUT: "Logout realizado",
    VIEW_USER: "Usuário visualizado",
    LIST_USERS: "Listagem de usuários",
    CREATE_USER: "Usuário criado",
    UPDATE_USER: "Usuário atualizado",
    DELETE_USER: "Usuário excluído",
    CHANGE_PASSWORD: "Senha alterada",
    CHANGE_ROLE: "Função alterada",
  }
  return labels[action] || action
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const data = await api.getAuditLogs()
      setLogs(data)
    } catch (error) {
      const apiError = error as ApiError
      toast({
        title: "Erro ao carregar logs",
        description: apiError.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(
    (log) =>
      getEventLabel(log.action).toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress?.includes(searchTerm) ||
      log.userId?.includes(searchTerm)
  )

  const stats = [
    { label: "Total de Eventos", value: logs.length, icon: Shield },
    { label: "Logins com Sucesso", value: logs.filter((l) => l.action === "LOGIN").length, icon: CheckCircle },
    { label: "Tentativas Falhas", value: logs.filter((l) => l.action === "LOGIN_FAILED").length, icon: XCircle },
    { label: "Alterações de Senha", value: logs.filter((l) => l.action === "CHANGE_PASSWORD").length, icon: Key },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Eventos</CardTitle>
              <CardDescription>Todos os eventos de autenticação e segurança registrados</CardDescription>
            </div>
            <Button onClick={loadLogs} variant="outline" size="sm">
              Atualizar
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por evento, usuário ou IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className={`mt-0.5 ${log.action.includes("FAILED") ? "text-destructive" : "text-accent"}`}>
                  {getEventIcon(log.action)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{getEventLabel(log.action)}</p>
                    {getStatusBadge(log.action)}
                  </div>
                  {log.details && (
                    <p className="text-sm text-muted-foreground">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                  <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                    <span>Entidade: {log.entityType}</span>
                    <span>•</span>
                    <span>IP: {log.ipAddress || "N/A"}</span>
                    <span>•</span>
                    <span>{new Date(log.createdAt).toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? `Nenhum evento encontrado para "${searchTerm}"` : "Nenhum evento registrado"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

