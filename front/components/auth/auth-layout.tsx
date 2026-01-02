import type React from "react"
import { Shield } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="relative z-10 max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <Shield className="h-12 w-12 text-primary-foreground" strokeWidth={1.5} />
            <h1 className="text-4xl font-bold text-primary-foreground">AuthGuard</h1>
          </div>
          <div className="space-y-4 text-primary-foreground/90">
            <h2 className="text-2xl font-semibold text-balance leading-tight">Identity Provider Centralizado</h2>
            <p className="text-lg leading-relaxed">
              Sistema de autenticação baseado em JWT com tokens de curta e longa duração, seguindo as melhores práticas
              de segurança.
            </p>
            <ul className="space-y-3 mt-6">
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
                <span>Access Token de 15 minutos</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
                <span>Refresh Token de 7 dias</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
                <span>Proteção contra força bruta</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <Shield className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold">AuthGuard</h1>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance">{title}</h2>
            <p className="text-muted-foreground text-pretty">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
