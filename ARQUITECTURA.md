# 📐 Arquitectura y Diseño - Luzara Turismo

## 🎯 Visión General

**Luzara Turismo** es una aplicación web full-stack para la gestión y venta de paquetes turísticos, construida con tecnologías modernas y siguiendo el patrón arquitectónico de aplicación monolítica con separación clara entre frontend y backend.

---

## 🏗️ Stack Tecnológico

### Frontend
- **Next.js 16.0.3** - Framework React con App Router (Server & Client Components)
- **React 19.2.0** - Biblioteca UI con nuevas características
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Estilos utility-first
- **Radix UI** - Componentes accesibles y sin estilos
- **Lucide React** - Iconos
- **React Hook Form + Zod** - Manejo y validación de formularios
- **Next Themes** - Soporte para tema claro/oscuro

### Backend & Base de Datos
- **Next.js API Routes** - Endpoints RESTful
- **MongoDB + Mongoose 9** - Base de datos NoSQL y ODM
- **AWS S3 SDK** - Almacenamiento de imágenes
- **Jose (JWT)** - Autenticación y autorización
- **bcryptjs** - Hash de contraseñas

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Vercel Analytics** - Analíticas integradas

---

## 📂 Estructura del Proyecto

```
LuzaraTurismo/
├── app/                          # App Router de Next.js
│   ├── layout.tsx                # Layout global con CartProvider
│   ├── page.tsx                  # Página principal (home)
│   ├── about/                    # Página "Sobre Nosotros"
│   ├── paquetes/                 # Listado de paquetes
│   ├── package/[id]/             # Detalle de paquete dinámico
│   ├── cart/                     # Carrito de compras
│   ├── checkout/                 # Proceso de checkout
│   ├── admin/                    # Panel administrativo
│   │   ├── layout.tsx            # Layout admin con Sidebar
│   │   ├── page.tsx              # Dashboard (estadísticas)
│   │   ├── packages/             # CRUD de paquetes
│   │   ├── orders/               # Gestión de pedidos
│   │   ├── departure-points/     # Puntos de salida
│   │   ├── business-info/        # Información del negocio
│   │   └── subscribers/          # Suscriptores del newsletter
│   └── api/                      # API Routes
│       ├── packages/             # Endpoints públicos de paquetes
│       ├── departure-points/     # Endpoints públicos
│       ├── business-info/        # Info del negocio (público)
│       └── admin/                # Endpoints protegidos
│           ├── login/
│           ├── packages/
│           ├── orders/
│           ├── departure-points/
│           ├── business-info/
│           └── stats/
│
├── components/                   # Componentes reutilizables
│   ├── header.tsx
│   ├── footer.tsx
│   ├── hero-section.tsx
│   ├── packages-section.tsx
│   ├── promotions-section.tsx
│   ├── cart-context.tsx          # Context API para carrito
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   └── login-form.tsx
│   └── ui/                       # Componentes UI de Radix
│
├── lib/                          # Lógica de negocio y utilidades
│   ├── auth.ts                   # JWT + bcrypt
│   ├── s3.ts                     # Cliente AWS S3
│   ├── storage.ts                # Abstracción de storage
│   ├── utils.ts                  # Utilidades (cn, etc.)
│   └── db/
│       ├── connect.ts            # Conexión a MongoDB
│       └── models/               # Modelos Mongoose
│           ├── Package.ts
│           ├── Order.ts
│           ├── User.ts
│           ├── DeparturePoint.ts
│           └── BusinessInfo.ts
│
├── types/                        # Tipos TypeScript compartidos
├── hooks/                        # Custom React Hooks
├── public/                       # Archivos estáticos
│   ├── images/
│   └── uploads/
└── scripts/                      # Scripts de utilidad
    └── create-admin.ts
```

---

## 🗄️ Modelos de Datos (MongoDB/Mongoose)

### 1. **Package** (Paquete Turístico)
```typescript
{
  title: string                    // Título del paquete
  destination: string              // Destino
  nights: number                   // Cantidad de noches
  departureDate: Date              // Fecha de salida principal
  price: number                    // Precio base
  priceFrom?: number               // "Desde" precio
  mainImage?: string               // Imagen principal (URL)
  gallery: string[]                // Galería de imágenes
  services: { icon, text }[]       // Servicios incluidos
  information: string[]            // Información adicional
  hotel: {                         // Datos del hotel
    name, roomType, zone, location, image
  }
  availableDates: number[]         // Fechas disponibles (timestamps)
  departurePoints: ObjectId[]      // Ref a DeparturePoint
  badge?: string                   // Etiqueta especial
  description?: string             // Descripción larga
  isPromotion: boolean             // ¿Es promoción?
  isPublished: boolean             // ¿Publicado?
  isActive: boolean                // ¿Activo?
  views: number                    // Contador de vistas
  clicks: number                   // Contador de clicks
  timestamps: true                 // createdAt, updatedAt
}
```

### 2. **Order** (Pedido)
```typescript
{
  userId?: ObjectId                // Ref a User (opcional)
  items: [{
    packageId: ObjectId,           // Ref a Package
    quantity: number,
    price: number,
    date?: string,
    details?: string
  }]
  total: number                    // Total del pedido
  status: enum                     // pending|paid|shipped|cancelled
  email?: string                   // Email del comprador
  timestamps: true
}
```

### 3. **User** (Usuario/Admin)
```typescript
{
  email: string                    // Email único
  password: string                 // Hash bcrypt
  name?: string
  role: enum                       // admin|user
  timestamps: true
}
```

### 4. **DeparturePoint** (Punto de Salida)
```typescript
{
  name: string                     // Nombre del punto
  address?: string                 // Dirección
  city?: string
  province?: string
  isActive: boolean
  timestamps: true
}
```

### 5. **BusinessInfo** (Información del Negocio)
```typescript
{
  businessName: string
  phone: string
  email: string
  whatsapp?: string
  address?: string
  socialMedia?: {
    facebook, instagram, twitter
  }
  about?: string                   // Texto "Sobre Nosotros"
  timestamps: true
}
```

---

## 🔄 Flujo de Datos y Arquitectura

### 🎨 Frontend (Client & Server Components)

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Cliente)                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────┐        │
│  │   Server Components (RSC)               │        │
│  │   - layout.tsx                          │        │
│  │   - page.tsx (SSR/SSG)                  │        │
│  │   - Fetch directo a DB en servidor      │        │
│  └────────────────────────────────────────┘        │
│                    ↓                                 │
│  ┌────────────────────────────────────────┐        │
│  │   Client Components ("use client")      │        │
│  │   - Interactividad                      │        │
│  │   - useState, useEffect                 │        │
│  │   - CartContext (Context API)           │        │
│  │   - Fetch a /api/* endpoints            │        │
│  └────────────────────────────────────────┘        │
│                    ↓                                 │
│  ┌────────────────────────────────────────┐        │
│  │   LocalStorage                          │        │
│  │   - Carrito de compras persistente      │        │
│  └────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

### 🔌 Backend (API Routes)

```
┌─────────────────────────────────────────────────────┐
│              Next.js API Routes                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📂 /api/packages (Público)                         │
│     GET → Listar paquetes (con filtros)             │
│     GET /:id → Detalle de paquete                   │
│                                                      │
│  📂 /api/departure-points (Público)                 │
│     GET → Listar puntos de salida                   │
│                                                      │
│  📂 /api/business-info (Público)                    │
│     GET → Información del negocio                   │
│                                                      │
│  🔒 /api/admin/* (Protegido con JWT)                │
│     - /login → Autenticación                        │
│     - /packages → CRUD paquetes                     │
│     - /orders → Gestión pedidos                     │
│     - /departure-points → CRUD puntos               │
│     - /business-info → Actualizar info              │
│     - /stats → Estadísticas dashboard               │
│                                                      │
│  Middleware de autenticación:                       │
│  ├─ Verificar cookie 'admin-auth'                   │
│  ├─ Validar JWT con jose                            │
│  └─ Autorizar acceso                                │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                  MongoDB Atlas                       │
│  (Base de datos en la nube)                         │
│                                                      │
│  Collections:                                       │
│  - packages                                         │
│  - orders                                           │
│  - users                                            │
│  - departurepoints                                  │
│  - businessinfos                                    │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Sistema de Autenticación

### Flujo de Login (Admin)

```
1. Usuario ingresa credenciales
   ↓
2. POST /api/admin/login
   ↓
3. Buscar usuario en MongoDB (User model)
   ↓
4. Verificar password con bcrypt.compare()
   ↓
5. Generar JWT token con jose (HS256)
   ↓
6. Setear cookie httpOnly 'admin-auth'
   - Expiración: 7 días
   - Secure en producción
   - SameSite: strict
   ↓
7. Redirigir a /admin (dashboard)
```

### Protección de Rutas

- **Frontend:** Redirect si no hay cookie
- **API:** Middleware `getAuthUserId()` verifica JWT
- **Cookie:** HttpOnly, no accesible desde JavaScript

---

## 🛒 Sistema de Carrito de Compras

### Arquitectura del Carrito

```typescript
// Context API + LocalStorage
CartContext {
  items: CartItem[]
  addItem(item: CartItem): void
  removeItem(id: string): void
  clear(): void
  total: number (computed)
}

CartItem {
  id: string
  title: string
  image: string
  price: number
  quantity: number
  date?: string
  details?: string
}
```

### Flujo de Compra

```
1. Usuario navega paquetes
   ↓
2. Agrega al carrito (CartContext.addItem)
   ↓
3. Persiste en localStorage
   ↓
4. Ve carrito (/cart)
   ↓
5. Checkout (/checkout)
   ↓
6. Completa formulario
   ↓
7. POST /api/orders (crear orden)
   ↓
8. Limpia carrito (CartContext.clear)
   ↓
9. Muestra confirmación
```

---

## 📸 Gestión de Imágenes

### Estrategia de Storage

```
┌────────────────────────────────────────┐
│  Opciones de Storage (lib/storage.ts)  │
├────────────────────────────────────────┤
│                                        │
│  1. AWS S3 (Producción)                │
│     - Escalable                        │
│     - CDN integrado                    │
│     - Configurado con @aws-sdk/s3      │
│                                        │
│  2. Local (Desarrollo)                 │
│     - /public/uploads/                 │
│     - Rápido para desarrollo           │
│                                        │
│  Abstracción en lib/storage.ts         │
│  permite cambiar entre ambos           │
└────────────────────────────────────────┘
```

---

## 🎨 Diseño de Componentes

### Patrón de Composición

```
Página (Server Component)
  ↓
Layout
  ↓
┌────────────────────────────┐
│ Header (Client Component)   │
├────────────────────────────┤
│ Hero Section               │
│ Promotions Section         │
│ Packages Section           │
│   ├─ PackageCard           │
│   ├─ PackageCard           │
│   └─ PackageCard           │
├────────────────────────────┤
│ Footer                     │
└────────────────────────────┘
```

### Sistema de Diseño

- **Shadcn/ui + Radix UI:** Componentes base accesibles
- **Tailwind CSS:** Estilos utility-first
- **Responsive:** Mobile-first design
- **Dark Mode:** Soporte con next-themes

---

## 🚀 Rutas Principales

### Públicas (Frontend)

| Ruta | Descripción | Tipo |
|------|-------------|------|
| `/` | Home con hero, promociones, paquetes | Server Component |
| `/about` | Sobre Nosotros | Server/Client |
| `/paquetes` | Listado completo de paquetes | Client Component |
| `/package/[id]` | Detalle de paquete específico | Server Component |
| `/cart` | Carrito de compras | Client Component |
| `/checkout` | Proceso de checkout | Client Component |

### Admin (Protegidas)

| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard con estadísticas |
| `/admin/packages` | CRUD de paquetes |
| `/admin/packages/create` | Crear nuevo paquete |
| `/admin/packages/[id]` | Editar paquete |
| `/admin/orders` | Gestión de pedidos |
| `/admin/departure-points` | CRUD puntos de salida |
| `/admin/business-info` | Configuración del negocio |
| `/admin/subscribers` | Lista de suscriptores |

### API Routes

**Públicas:**
- `GET /api/packages` - Listar paquetes (con filtros)
- `GET /api/packages/[id]` - Detalle de paquete
- `GET /api/departure-points` - Puntos de salida
- `GET /api/business-info` - Info del negocio

**Admin (JWT requerido):**
- `POST /api/admin/login` - Login
- `GET/POST/PUT/DELETE /api/admin/packages` - CRUD
- `GET /api/admin/orders` - Pedidos
- `GET /api/admin/stats` - Estadísticas

---

## 🔍 Características Destacadas

### 1. **Server Components by Default**
- Reduce bundle de JavaScript
- Mejor SEO y performance
- Fetch directo a DB en servidor

### 2. **Optimización de Imágenes**
- Next.js Image component
- Lazy loading automático
- Responsive images

### 3. **Filtros Inteligentes**
- Por destino
- Por punto de salida
- Por tipo (promociones)
- Por fechas disponibles

### 4. **Analytics Integrados**
- Vercel Analytics
- Tracking de views y clicks en paquetes
- Estadísticas en dashboard admin

### 5. **TypeScript End-to-End**
- Modelos tipados (Mongoose + TS)
- Props de componentes tipadas
- API responses tipadas

---

## 🛠️ Patrones de Diseño Utilizados

### 1. **Repository Pattern** (implícito)
```typescript
// Modelos Mongoose encapsulan acceso a datos
Package.find({ isPublished: true })
Order.create({ items, total })
```

### 2. **Context API Pattern**
```typescript
// Estado global sin Redux
<CartProvider>
  <App />
</CartProvider>
```

### 3. **Factory Pattern** (Conexión DB)
```typescript
// Singleton de conexión MongoDB
const connectDB = async () => {
  if (cached.conn) return cached.conn
  // ...
}
```

### 4. **Middleware Pattern**
```typescript
// Protección de rutas admin
export async function GET(req: NextRequest) {
  const userId = await getAuthUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // ...
}
```

---

## 📊 Flujo de Datos Completo

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Usuario visita /paquetes
       ↓
┌─────────────────────────┐
│  Server Component       │
│  - SSR en servidor      │
│  - Fetch inicial        │
└──────┬──────────────────┘
       │
       │ 2. Hydration
       ↓
┌─────────────────────────┐
│  Client Component       │
│  - Interactividad       │
│  - Filtros dinámicos    │
└──────┬──────────────────┘
       │
       │ 3. Fetch filtrado: GET /api/packages?destination=...
       ↓
┌─────────────────────────┐
│  API Route              │
│  - Conecta a MongoDB    │
│  - Ejecuta query        │
└──────┬──────────────────┘
       │
       │ 4. Mongoose query
       ↓
┌─────────────────────────┐
│  MongoDB Atlas          │
│  - Colección packages   │
│  - Retorna documentos   │
└──────┬──────────────────┘
       │
       │ 5. JSON response
       ↓
┌─────────────────────────┐
│  Browser                │
│  - Actualiza UI         │
│  - Muestra paquetes     │
└─────────────────────────┘
```

---

## 🔧 Variables de Entorno Requeridas

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=tu-secreto-super-seguro

# AWS S3 (opcional, para storage de imágenes)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=luzara-turismo

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📦 Scripts Disponibles

```bash
npm run dev      # Desarrollo en localhost:3000
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linting con ESLint
```

---

## 🎯 Principios Arquitectónicos

1. **Separación de Responsabilidades**
   - Frontend: Presentación e interacción
   - API Routes: Lógica de negocio
   - Models: Acceso a datos
   - Lib: Utilidades compartidas

2. **DRY (Don't Repeat Yourself)**
   - Componentes UI reutilizables
   - Funciones de utilidad centralizadas
   - Middleware compartido

3. **Security First**
   - JWT con cookies httpOnly
   - Validación en frontend y backend
   - Sanitización de inputs

4. **Performance**
   - Server Components por defecto
   - Lazy loading de imágenes
   - MongoDB indexes en campos frecuentes

5. **Scalability**
   - API stateless
   - Storage externo (S3)
   - Database cloud (MongoDB Atlas)

---

## 🚀 Mejoras Futuras (Roadmap)

- [ ] Sistema de pagos (Mercado Pago, Stripe)
- [ ] Notificaciones por email (Resend, SendGrid)
- [ ] Sistema de reviews y ratings
- [ ] Multi-idioma (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Tests automatizados (Jest, Playwright)
- [ ] CI/CD con GitHub Actions
- [ ] Logs y monitoring (Sentry)
- [ ] Cache con Redis
- [ ] GraphQL API (opcional)

---

## 📚 Recursos y Documentación

- [Next.js 16 Docs](https://nextjs.org/docs)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

## 👥 Contribuciones

Este proyecto sigue las mejores prácticas de desarrollo moderno con Next.js y TypeScript. Para contribuir, revisar este documento de arquitectura y mantener la consistencia en los patrones establecidos.

---

**Última actualización:** Diciembre 2025  
**Versión:** 1.0.0
