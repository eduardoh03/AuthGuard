export const mockUser = {
  id: "usr_123456789",
  username: "demo_user",
  email: "demo@authguard.com",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-20T14:45:00Z",
}

export const mockUsers = [
  {
    id: "usr_123456789",
    username: "demo_user",
    email: "demo@authguard.com",
    role: "admin",
    status: "active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    loginAttempts: 0,
  },
  {
    id: "usr_987654321",
    username: "john_doe",
    email: "john.doe@example.com",
    role: "user",
    status: "active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    createdAt: "2024-01-10T08:20:00Z",
    updatedAt: "2024-01-18T16:30:00Z",
    loginAttempts: 0,
  },
  {
    id: "usr_456789123",
    username: "jane_smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    createdAt: "2024-01-12T14:15:00Z",
    updatedAt: "2024-01-19T09:20:00Z",
    loginAttempts: 0,
  },
  {
    id: "usr_789123456",
    username: "bob_wilson",
    email: "bob.wilson@example.com",
    role: "user",
    status: "suspended",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    createdAt: "2024-01-05T11:45:00Z",
    updatedAt: "2024-01-17T13:00:00Z",
    loginAttempts: 3,
  },
  {
    id: "usr_321654987",
    username: "alice_brown",
    email: "alice.brown@example.com",
    role: "admin",
    status: "active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    createdAt: "2024-01-08T09:30:00Z",
    updatedAt: "2024-01-20T10:15:00Z",
    loginAttempts: 0,
  },
  {
    id: "usr_654987321",
    username: "charlie_davis",
    email: "charlie.davis@example.com",
    role: "user",
    status: "blocked",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
    createdAt: "2024-01-03T15:20:00Z",
    updatedAt: "2024-01-16T11:45:00Z",
    loginAttempts: 5,
  },
  {
    id: "usr_147258369",
    username: "emma_johnson",
    email: "emma.johnson@example.com",
    role: "user",
    status: "active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    createdAt: "2024-01-14T12:00:00Z",
    updatedAt: "2024-01-20T08:30:00Z",
    loginAttempts: 1,
  },
  {
    id: "usr_369258147",
    username: "david_miller",
    email: "david.miller@example.com",
    role: "user",
    status: "active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    createdAt: "2024-01-11T10:45:00Z",
    updatedAt: "2024-01-19T14:20:00Z",
    loginAttempts: 0,
  },
]

export const mockAuditLogs = [
  {
    id: "log_001",
    event: "LOGIN_SUCCESS",
    username: "demo_user",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    details: "Login bem-sucedido com credenciais válidas",
  },
  {
    id: "log_002",
    event: "TOKEN_REFRESH",
    username: "demo_user",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    details: "Token de acesso renovado com sucesso",
  },
  {
    id: "log_003",
    event: "PASSWORD_CHANGE",
    username: "demo_user",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    details: "Senha alterada com sucesso",
  },
  {
    id: "log_004",
    event: "LOGIN_FAILED",
    username: "demo_user",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/605.1",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    details: "Tentativa de login com senha incorreta",
  },
  {
    id: "log_005",
    event: "LOGIN_SUCCESS",
    username: "demo_user",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    details: "Login bem-sucedido com credenciais válidas",
  },
  {
    id: "log_006",
    event: "LOGOUT",
    username: "demo_user",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 25 hours ago
    details: "Logout realizado pelo usuário",
  },
  {
    id: "log_007",
    event: "ACCOUNT_CREATED",
    username: "demo_user",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    details: "Conta criada com sucesso",
  },
]

// Mock JWT token generator
export function generateMockToken(): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = btoa(
    JSON.stringify({
      sub: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
    }),
  )
  const signature = "mock_signature_" + Math.random().toString(36).substring(2)

  return `${header}.${payload}.${signature}`
}

export function generateMockRefreshToken(): string {
  return "refresh_token_" + Math.random().toString(36).substring(2) + Date.now()
}
