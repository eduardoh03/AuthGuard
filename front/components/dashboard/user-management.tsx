"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, MoreVertical, Shield, User, Trash2, Loader2, AlertTriangle } from "lucide-react"
import { api, type UserResponse, type AdminUserResponse, type ApiError } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

type UserRole = "ADMIN" | "USER"

interface UserWithRole extends AdminUserResponse {
  role: UserRole
}

export function UserManagement() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is admin from token
    const adminStatus = api.isAdmin()
    setIsAdmin(adminStatus)
    loadUsers(adminStatus)
  }, [])

  const loadUsers = async (adminStatus: boolean) => {
    try {
      setLoading(true)
      if (adminStatus) {
        // Admin can see all users
        const data = await api.getUsers()
        setUsers(data as UserWithRole[])
      } else {
        // Regular user can only see their own profile
        const currentUser = await api.getCurrentUser()
        setUsers([currentUser as UserWithRole])
      }
    } catch (error) {
      const apiError = error as ApiError
      toast({
        title: "Erro ao carregar usuários",
        description: apiError.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.changeRole(userId, newRole)
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: newRole, updatedAt: new Date().toISOString() } : user))
      )
      toast({
        title: "Função alterada",
        description: `Usuário agora é ${newRole === "ADMIN" ? "Administrador" : "Usuário comum"}`,
      })
    } catch (error) {
      const apiError = error as ApiError
      toast({
        title: "Erro ao alterar função",
        description: apiError.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId)
      setUsers((prev) => prev.filter((user) => user.id !== userId))
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido do sistema",
      })
    } catch (error) {
      const apiError = error as ApiError
      toast({
        title: "Erro ao excluir usuário",
        description: apiError.message,
        variant: "destructive",
      })
    }
  }

  const getRoleBadge = (role: UserRole) => {
    return role === "ADMIN" ? (
      <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
        <User className="h-3 w-3 mr-1" />
        Usuário
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const stats = [
    { label: "Total de Usuários", value: users.length, color: "text-primary" },
    { label: "Administradores", value: users.filter((u) => u.role === "ADMIN").length, color: "text-primary" },
    { label: "Usuários Comuns", value: users.filter((u) => u.role === "USER").length, color: "text-muted-foreground" },
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
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Visualize e gerencie todos os usuários do sistema</CardDescription>
            </div>
            <Button onClick={() => loadUsers(isAdmin)} variant="outline" size="sm">
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  {isAdmin && <TableHead>Tentativas</TableHead>}
                  {isAdmin && <TableHead>Status</TableHead>}
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-default">{user.id.substring(0, 8)}...</span>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {user.id}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-default truncate block">{user.email}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {user.email}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-center">
                        {user.failedLoginAttempts > 0 ? (
                          <Badge variant="outline" className="text-orange-600">
                            {user.failedLoginAttempts}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                    )}
                    {isAdmin && (
                      <TableCell>
                        {user.accountLocked ? (
                          <Badge className="bg-red-500/20 text-red-700 dark:text-red-300 gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Bloqueado
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                            Ativo
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(user.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {isAdmin && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.id, user.role === "ADMIN" ? "USER" : "ADMIN")}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                {user.role === "ADMIN" ? "Rebaixar para Usuário" : "Promover para Admin"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isAdmin ? "Excluir Usuário" : "Excluir Minha Conta"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

