import { RegisterForm } from "@/components/auth/register-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function RegisterPage() {
  return (
    <AuthLayout title="Criar nova conta" subtitle="Registre-se para começar a usar o AuthGuard IdP">
      <RegisterForm />
    </AuthLayout>
  )
}
