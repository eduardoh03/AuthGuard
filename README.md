# AuthGuard IdP

Sistema completo de autenticacao e autorizacao composto por uma API backend (Identity Provider) e um frontend moderno para gerenciamento de usuarios e credenciais.

## Arquitetura do Projeto

```
IdP/
├── back/           # API REST (Spring Boot 4.0 + Java 25)
└── front/          # Interface Web (Next.js 16 + React 19)
```

## Stack Tecnologica

### Backend (`/back`)

| Componente       | Tecnologia            |
|------------------|-----------------------|
| Framework        | Spring Boot 4.0       |
| Linguagem        | Java 25               |
| Banco de Dados   | PostgreSQL 16         |
| Seguranca        | Spring Security + JWT |
| Migracoes        | Flyway                |
| Build            | Maven                 |

### Frontend (`/front`)

| Componente       | Tecnologia            |
|------------------|-----------------------|
| Framework        | Next.js 16            |
| Linguagem        | TypeScript            |
| UI Library       | React 19              |
| Componentes      | Radix UI + shadcn/ui  |
| Estilizacao      | Tailwind CSS 4        |
| Formularios      | React Hook Form + Zod |

## Funcionalidades

- Autenticacao baseada em JWT (Access Token + Refresh Token)
- Registro e login de usuarios
- Dashboard administrativo com controle de acesso por roles
- Painel Home para usuarios regulares
- Bloqueio de conta apos tentativas falhas de login
- Alteracao de senha
- Tema claro/escuro

## Quick Start

### Pre-requisitos

- Java 25+
- Node.js 18+
- Docker e Docker Compose
- Maven 3.9+
- Yarn ou npm

### 1. Iniciar o Banco de Dados

```bash
cd back
docker-compose up -d
```

### 2. Executar o Backend

```bash
cd back
./mvnw spring-boot:run
```

O backend estara disponivel em `http://localhost:8080`

### 3. Executar o Frontend

```bash
cd front
yarn install
yarn dev
```

O frontend estara disponivel em `http://localhost:3000`

## Fluxos de Autenticacao

### Login

```
Cliente → POST /api/auth/login → Valida credenciais → Retorna Access Token + Refresh Token
```

### Acesso a Recursos Protegidos

```
Cliente → GET /api/recurso (Authorization: Bearer <token>) → Valida token → Libera acesso
```

### Renovacao de Token

```
Cliente → POST /api/auth/refresh → Valida Refresh Token → Retorna novos tokens
```

## Endpoints Principais

| Metodo | Endpoint              | Descricao                      | Autenticado |
|--------|-----------------------|--------------------------------|-------------|
| POST   | `/api/auth/register`  | Registrar novo usuario         | Nao         |
| POST   | `/api/auth/login`     | Autenticar usuario             | Nao         |
| POST   | `/api/auth/refresh`   | Renovar Access Token           | Nao         |
| GET    | `/api/users/me`       | Obter dados do usuario atual   | Sim         |
| PUT    | `/api/users/password` | Alterar senha                  | Sim         |

## Variaveis de Ambiente

### Backend

| Variavel                         | Descricao                              | Valor Padrao                              |
|----------------------------------|----------------------------------------|-------------------------------------------|
| `SPRING_DATASOURCE_URL`          | URL de conexao do banco                | jdbc:postgresql://localhost:5436/idp_db  |
| `SPRING_DATASOURCE_USERNAME`     | Usuario do banco                       | idp_user                                  |
| `SPRING_DATASOURCE_PASSWORD`     | Senha do banco                         | idp_password                              |
| `JWT_SECRET`                     | Chave secreta para assinatura JWT      | (necessario configurar)                   |
| `JWT_EXPIRATION`                 | Expiracao do Access Token (ms)         | 900000 (15 min)                           |
| `JWT_REFRESH_EXPIRATION`         | Expiracao do Refresh Token (ms)        | 604800000 (7 dias)                        |

## Estrutura de Pastas

```
back/
├── src/main/java/com/eduardoh03/IdP/
│   ├── application/        # Casos de uso e DTOs
│   ├── domain/             # Entidades e regras de negocio
│   ├── infrastructure/     # Configuracoes e implementacoes
│   └── presentation/       # Controllers REST
└── src/main/resources/
    └── db/migration/       # Scripts Flyway

front/
├── app/                    # Rotas Next.js (App Router)
├── components/             # Componentes React
├── hooks/                  # Custom hooks
├── lib/                    # Utilitarios
└── styles/                 # Estilos globais
```

## Seguranca

- Senhas armazenadas com BCrypt
- Tokens JWT assinados com HMAC-SHA256
- Access Token de curta duracao (15 min)
- Refresh Token de longa duracao (7 dias)
- Protecao contra brute force com bloqueio temporario
- Validacao de tokens em todas as requisicoes autenticadas

## Documentacao Detalhada

Para informacoes mais detalhadas sobre o backend, consulte o [README do Backend](./back/README.md).
