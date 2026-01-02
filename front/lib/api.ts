const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path?: string;
    validationErrors?: Record<string, string>;
}

class ApiService {
    private getAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    }

    setAccessToken(token: string, rememberMe: boolean = false) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
        }
    }

    clearTokens() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Keep savedEmail and rememberMe for "remember me" feature
        }
    }


    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const token = this.getAccessToken();
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error: ApiError = await response.json().catch(() => ({
                timestamp: new Date().toISOString(),
                status: response.status,
                error: response.statusText,
                message: 'Erro ao processar requisição',
            }));

            if (response.status === 401) {
                this.clearTokens();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }

            throw error;
        }

        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    // Auth endpoints
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        // Backend returns snake_case: access_token, refresh_token
        this.setAccessToken(response.access_token);
        if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', response.refresh_token);
        }

        return response;
    }

    // User endpoints
    async register(email: string, password: string, role?: string): Promise<UserResponse> {
        return this.request<UserResponse>('/api/users', {
            method: 'POST',
            body: JSON.stringify({ email, password, role }),
        });
    }

    async getUsers(): Promise<UserResponse[]> {
        return this.request<UserResponse[]>('/api/users');
    }

    async getUserById(id: string): Promise<UserResponse> {
        return this.request<UserResponse>(`/api/users/${id}`);
    }

    async updateUser(id: string, email: string): Promise<UserResponse> {
        return this.request<UserResponse>(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ email }),
        });
    }

    async deleteUser(id: string): Promise<void> {
        return this.request<void>(`/api/users/${id}`, {
            method: 'DELETE',
        });
    }

    async changePassword(id: string, currentPassword: string, newPassword: string): Promise<UserResponse> {
        return this.request<UserResponse>(`/api/users/${id}/password`, {
            method: 'PATCH',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    }

    async changeRole(id: string, role: string): Promise<UserResponse> {
        return this.request<UserResponse>(`/api/users/${id}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role }),
        });
    }

    // Audit endpoints
    async getAuditLogs(): Promise<AuditLogResponse[]> {
        return this.request<AuditLogResponse[]>('/api/audit');
    }

    async getAuditLogsByUser(userId: string): Promise<AuditLogResponse[]> {
        return this.request<AuditLogResponse[]>(`/api/audit/users/${userId}`);
    }
}

// Types - using snake_case to match backend response
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

export interface UserResponse {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuditLogResponse {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    details: Record<string, unknown>;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
}

export const api = new ApiService();
export type { ApiError };
