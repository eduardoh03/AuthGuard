"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
    children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("accessToken")

        // Public routes that don't require authentication
        const publicRoutes = ["/login", "/register"]
        const isPublicRoute = publicRoutes.includes(pathname)

        if (!token && !isPublicRoute) {
            router.push("/login")
            return
        }

        if (token && isPublicRoute) {
            router.push("/dashboard")
            return
        }

        setIsAuthenticated(!!token || isPublicRoute)
    }, [pathname, router])

    // Show nothing while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return <>{children}</>
}
