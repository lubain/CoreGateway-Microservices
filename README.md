# 🚀 Architecture GraphQL Federation — NestJS

Monorepo composé de 3 services NestJS communiquant via **Apollo Federation v2**.

```
┌─────────────────────────────────────┐
│        CLIENT (browser / app)       │
└────────────────┬────────────────────┘
                 │ HTTP :3000
                 ▼
┌─────────────────────────────────────┐
│     API GATEWAY (Supergraph)        │  ← port 3000
│  IntrospectAndCompose + Auth relay  │
└────────────┬────────────┬───────────┘
             │            │
      :3001  ▼     :3002  ▼
┌────────────────┐  ┌────────────────┐
│  Users Service │  │ Orders Service │
│  @key(id)      │  │  @key(id)      │
└────────────────┘  └────────────────┘
```

---

## 📁 Structure

```
.
├── api-gateway/          # Votre gateway existante (port 3000)
├── users-service/        # Microservice Users (port 3001)
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.guard.ts        # Guard JWT
│   │   │   └── public.decorator.ts  # @Public()
│   │   └── users/
│   │       ├── entities/user.entity.ts
│   │       ├── dto/user.dto.ts
│   │       ├── users.service.ts
│   │       ├── users.service.spec.ts
│   │       ├── users.resolver.ts
│   │       ├── users.resolver.spec.ts
│   │       └── users.module.ts
│   ├── Dockerfile
│   ├── nest-cli.json
│   └── tsconfig.json
├── orders-service/       # Microservice Orders (port 3002)
│   └── ...               # même structure que users-service
└── docker-compose.yml
```

---

## ⚡ Démarrage rapide

### Sans Docker

```bash
# Terminal 1 — Users Service
cd users-service && npm install && npm run start:dev

# Terminal 2 — Orders Service
cd orders-service && npm install && npm run start:dev

# Terminal 3 — API Gateway
cd api-gateway && npm install && npm run start:dev
```

### Avec Docker

```bash
docker-compose up --build
```

---

## 🔐 Authentification

Les **mutations** sont protégées par `AuthGuard`. Il faut envoyer un header :

```
Authorization: Bearer <token>
```

Les **queries** sont publiques (`@Public()`).

> Pour activer la vérification réelle du JWT, installez `@nestjs/jwt` et
> décommentez les lignes `JwtService.verify(...)` dans `auth.guard.ts`.

---

## 🧪 Tests

```bash
# Dans users-service ou orders-service
npm run test          # tests unitaires
npm run test:cov      # avec couverture
```

---

## 📡 Exemples de requêtes GraphQL

### Récupérer tous les utilisateurs avec leurs commandes

```graphql
query {
  users {
    id
    name
    email
  }
}
```

### Créer une commande (auth requise)

```graphql
mutation {
  createOrder(
    input: {
      userId: "1"
      items: [
        { productId: "p1", productName: "Laptop", price: 999.99, quantity: 1 }
      ]
    }
  ) {
    id
    totalAmount
    status
    createdAt
  }
}
```

### Changer le statut d'une commande

```graphql
mutation {
  updateOrderStatus(id: "101", input: { status: "CONFIRMED" }) {
    id
    status
    updatedAt
  }
}
```

---

## 🔄 Statuts de commande

```
PENDING → CONFIRMED → SHIPPED → DELIVERED
                   ↘ CANCELLED
```

---

## 🛣️ Prochaines étapes suggérées

- [ ] Remplacer la BDD en mémoire par **TypeORM + PostgreSQL** ou **Prisma**
- [ ] Implémenter la vérification JWT complète (`@nestjs/jwt`)
- [ ] Ajouter un service **Auth** dédié (login / register / refresh token)
- [ ] Mettre en place **DataLoader** pour éviter le problème N+1
- [ ] Ajouter la validation des inputs avec `class-validator`
