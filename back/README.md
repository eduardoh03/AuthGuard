# AuthGuard - Identity Provider (IdP)

Sistema de autenticacao e autorizacao isolado que funciona como uma API centralizada para gerenciamento de credenciais. Outras aplicacoes (Frontend, microsservicos) consomem esta API exclusivamente para operacoes de autenticacao.

## Visao Geral

O AuthGuard IdP implementa um sistema de autenticacao baseado em JWT (JSON Web Tokens) com suporte a tokens de curta e longa duracao, seguindo as melhores praticas de seguranca.

### Caracteristicas Principais

- Autenticacao baseada em JWT
- Access Token de curta duracao (15 minutos)
- Refresh Token de longa duracao (7 dias)
- Protecao contra ataques de forca bruta (bloqueio apos tentativas falhas)
- Migracao de banco de dados com Flyway
- API RESTful

## Stack Tecnologica

| Componente       | Tecnologia            |
|------------------|-----------------------|
| Framework        | Spring Boot 4.0       |
| Linguagem        | Java 25               |
| Banco de Dados   | PostgreSQL 16         |
| Seguranca        | Spring Security + JWT |
| Migracoes        | Flyway                |
| Build            | Maven                 |
| Container        | Docker                |

## Fluxos de Autenticacao

### Fluxo de Login

```
+----------+       +-------------+       +------------------+
|  Cliente | ----> | POST /login | ----> | Valida user/pass |
+----------+       +-------------+       +------------------+
                                                  |
                                                  v
                   +---------------------------+--+---------------------------+
                   |                           |                              |
                   v                           v                              v
            +--------------+          +---------------+              +--------+--------+
            | Access Token |          | Refresh Token |              | Retorna ambos   |
            | (curta dur.) |          | (longa dur.)  |              | tokens ao       |
            | 15 minutos   |          | 7 dias        |              | cliente         |
            +--------------+          +---------------+              +-----------------+
```

**Descricao do Fluxo:**

1. O cliente envia credenciais (usuario/senha) via `POST /api/auth/login`
2. A API valida as credenciais contra o banco de dados
3. Se validas, gera dois tokens:
   - **Access Token**: Token de curta duracao (15 minutos) para autenticacao em requisicoes
   - **Refresh Token**: Token de longa duracao (7 dias) para renovacao do Access Token
4. Retorna ambos os tokens ao cliente

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "usuario",
    "password": "senha"
}
```

**Response (200 OK):**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900
}
```

---

### Fluxo de Acesso

```
+----------+       +------------------+       +--------------------+
|  Cliente | ----> | GET /recurso     | ----> | Valida assinatura  |
|          |       | Authorization:   |       | do Access Token    |
|          |       | Bearer <token>   |       +--------------------+
+----------+       +------------------+                 |
                                                        v
                                         +-----------------------------+
                                         |  Token valido?              |
                                         +-----------------------------+
                                                |              |
                                                v              v
                                         +----------+    +-----------+
                                         |   Sim    |    |    Nao    |
                                         | Libera   |    | Retorna   |
                                         | acesso   |    | 401       |
                                         +----------+    +-----------+
```

**Descricao do Fluxo:**

1. O cliente inclui o Access Token no header `Authorization` de cada requisicao
2. A API intercepta a requisicao e valida a assinatura do token
3. Verifica se o token nao esta expirado
4. Se valido, libera o acesso ao recurso solicitado
5. Se invalido ou expirado, retorna erro 401 (Unauthorized)

**Request Autenticada:**
```http
GET /api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Fluxo de Refresh Token

Quando o Access Token expira, o cliente pode obter um novo sem necessidade de reautenticacao:

```http
POST /api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900
}
```

## Configuracao

### Pre-requisitos

- Java 25+
- Maven 3.9+
- Docker e Docker Compose
- PostgreSQL 16 (ou via Docker)

### Variaveis de Ambiente

| Variavel                         | Descricao                          | Valor Padrao     |
|----------------------------------|------------------------------------|------------------|
| `SPRING_DATASOURCE_URL`          | URL de conexao do banco            | jdbc:postgresql://localhost:5436/idp_db |
| `SPRING_DATASOURCE_USERNAME`     | Usuario do banco                   | idp_user         |
| `SPRING_DATASOURCE_PASSWORD`     | Senha do banco                     | idp_password     |
| `JWT_SECRET`                     | Chave secreta para assinatura JWT  | (base64 encoded) |
| `JWT_EXPIRATION`                 | Tempo de expiracao do Access Token (ms)  | 900000 (15min)  |
| `JWT_REFRESH_EXPIRATION`         | Tempo de expiracao do Refresh Token (ms) | 604800000 (7d) |
| `SECURITY_MAX_FAILED_ATTEMPTS`   | Tentativas maximas antes do bloqueio | 5              |
| `SECURITY_LOCKOUT_DURATION_MINUTES` | Duracao do bloqueio (minutos)   | 15               |

### Execucao Local

1. **Iniciar o banco de dados:**
```bash
docker-compose up -d
```

2. **Compilar o projeto:**
```bash
./mvnw clean package -DskipTests
```

3. **Executar a aplicacao:**
```bash
./mvnw spring-boot:run
```

A API estara disponivel em `http://localhost:8080`.

## Estrutura do Projeto

```
src/
├── main/
│   ├── java/com/eduardoh03/IdP/
│   │   ├── application/        # Casos de uso
│   │   ├── domain/             # Entidades e regras de negocio
│   │   ├── infrastructure/     # Implementacoes tecnicas
│   │   └── presentation/       # Controllers e DTOs
│   └── resources/
│       ├── db/migration/       # Scripts Flyway
│       └── application.properties
└── test/                       # Testes automatizados
```

## Endpoints da API

| Metodo | Endpoint              | Descricao                      | Autenticado |
|--------|-----------------------|--------------------------------|-------------|
| POST   | `/api/auth/register`  | Registrar novo usuario         | Nao         |
| POST   | `/api/auth/login`     | Autenticar usuario             | Nao         |
| POST   | `/api/auth/refresh`   | Renovar Access Token           | Nao         |
| GET    | `/api/users/me`       | Obter dados do usuario atual   | Sim         |
| PUT    | `/api/users/password` | Alterar senha                  | Sim         |

## Seguranca

- Senhas armazenadas com BCrypt
- Tokens assinados com HMAC-SHA256
- Protecao contra brute force com bloqueio temporario
- Validacao de tokens em todas as requisicoes autenticadas
- Refresh Token rotativo (novo token a cada refresh)

## Licenca

Este projeto esta sob licenca proprietaria. Todos os direitos reservados.
