import { LoginForm } from "@/components/auth/login-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function LoginPage() {
  return (
    <AuthLayout title="Bem-vindo ao AuthGuard" subtitle="Entre com suas credenciais para acessar o sistema">
      <LoginForm />
    </AuthLayout>
  )
}
