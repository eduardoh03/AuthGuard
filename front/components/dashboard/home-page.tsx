"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Key, FileCheck, Users, Activity } from "lucide-react"

export function HomePage() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Shield className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                    Bem-vindo ao <span className="text-primary">AuthGuard</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Sistema de Autenticação e Autorização baseado em JWT para gerenciamento seguro de identidades
                </p>
                <Badge variant="secondary" className="text-sm">
                    Identity Provider (IdP)
                </Badge>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Autenticação Segura</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Login com validação de credenciais, proteção contra brute-force e bloqueio temporário de contas
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <Key className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Tokens JWT</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Access Token de curta duração e Refresh Token para sessões seguras sem armazenamento de estado
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Controle de Acesso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Sistema de roles (ADMIN/USER) com permissões granulares para cada funcionalidade
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Auditoria Completa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Registro detalhado de todas as ações: logins, alterações de senha, mudanças de role e mais
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">API RESTful</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Endpoints bem documentados para integração com qualquer aplicação frontend ou serviço externo
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Spring Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Backend robusto com Spring Boot, validação de requisições e proteção contra vulnerabilidades comuns
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>

            {/* Tech Stack */}
            <Card>
                <CardHeader>
                    <CardTitle>Stack Tecnológico</CardTitle>
                    <CardDescription>Tecnologias utilizadas neste projeto</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Spring Boot 4</Badge>
                        <Badge variant="outline">Spring Security</Badge>
                        <Badge variant="outline">JWT</Badge>
                        <Badge variant="outline">PostgreSQL</Badge>
                        <Badge variant="outline">Flyway</Badge>
                        <Badge variant="outline">Next.js 16</Badge>
                        <Badge variant="outline">React</Badge>
                        <Badge variant="outline">TypeScript</Badge>
                        <Badge variant="outline">Tailwind CSS</Badge>
                        <Badge variant="outline">shadcn/ui</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
