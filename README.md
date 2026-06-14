# 🍗 Pollería Online — Sistema de Pedidos

Aplicación web completa para tomar pedidos en línea con panel administrativo.

## Tecnologías

| Capa       | Tecnología                    |
|------------|-------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS |
| Backend    | Node.js + Express             |
| Base datos | PostgreSQL 14+                |
| Auth       | JWT + bcryptjs                |

---

## Estructura del proyecto

```
Sistema_Polleria/
├── database/
│   ├── schema.sql       ← Crear tablas
│   └── seed.sql         ← Datos iniciales
├── server/              ← API REST (Node.js)
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── config/database.js
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── scripts/setupAdmin.js
└── client/              ← Frontend React
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── pages/       ← Home, Admin, AdminLogin
        ├── components/  ← Navbar, Hero, Cart, OrderForm...
        ├── context/     ← CartContext
        └── services/    ← api.js (Axios)
```

---

## Instalación paso a paso

### Requisitos previos

- [Node.js 18+](https://nodejs.org) — verifica con `node -v`
- [PostgreSQL 14+](https://www.postgresql.org/download/) — verifica con `psql --version`
- [VS Code](https://code.visualstudio.com/)

---

### Paso 1 — Configurar PostgreSQL

Abre **pgAdmin** o la terminal y ejecuta:

```sql
-- Crear base de datos
CREATE DATABASE polleria_db;
```

Luego carga los scripts:

```bash
# Opción A: desde psql
psql -U postgres -d polleria_db -f database/schema.sql
psql -U postgres -d polleria_db -f database/seed.sql

# Opción B: desde pgAdmin
-- Abre pgAdmin → polleria_db → Query Tool
-- Pega y ejecuta el contenido de schema.sql y luego seed.sql
```

---

### Paso 2 — Configurar el servidor

```bash
# 1. Entrar a la carpeta del servidor
cd server

# 2. Instalar dependencias
npm install

# 3. Crear archivo de configuración
copy .env.example .env
```

Abre `.env` y edita los valores:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=polleria_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_DE_POSTGRES

JWT_SECRET=una_cadena_larga_y_secreta_aqui

# Tu número de WhatsApp (México: 521 + 10 dígitos)
OWNER_WHATSAPP=5215512345678
OWNER_NAME=La Pollería
```

---

### Paso 3 — Crear el usuario administrador

```bash
# Dentro de la carpeta server:
npm run setup-admin
```

Esto preguntará usuario, contraseña y nombre. Por defecto:
- **Usuario:** `admin`
- **Contraseña:** `polleria2024`

---

### Paso 4 — Iniciar el servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor corre en: `http://localhost:4000`

Verifica que funciona: `http://localhost:4000/api/health`

---

### Paso 5 — Configurar el frontend

Abre **otra terminal** y ejecuta:

```bash
# 1. Entrar a la carpeta del cliente
cd client

# 2. Instalar dependencias
npm install

# 3. Iniciar en desarrollo
npm run dev
```

La app corre en: `http://localhost:5173`

---

## Accesos

| Sección              | URL                               | Credenciales         |
|----------------------|-----------------------------------|----------------------|
| Tienda (clientes)    | http://localhost:5173             | Público              |
| Panel admin          | http://localhost:5173/admin       | admin / polleria2024 |
| API REST             | http://localhost:4000/api         | Token JWT            |

---

## API Endpoints

### Públicos
```
GET  /api/products/categories    → Lista de categorías
GET  /api/products               → Lista de productos (filtro: ?category_id=N)
POST /api/orders                 → Crear pedido
```

### Admin (requieren Authorization: Bearer TOKEN)
```
POST   /api/admin/login          → Iniciar sesión
GET    /api/admin/orders         → Listar pedidos (filtros: ?status=&date=YYYY-MM-DD)
PATCH  /api/admin/orders/:id     → Cambiar estado del pedido
GET    /api/admin/summary        → Resumen del día
```

---

## WhatsApp — Opciones de integración

### Opción gratuita (ya implementada ✅)

Al confirmar un pedido, el sistema genera un enlace pre-rellenado:
```
https://wa.me/521XXXXXXXXXX?text=...mensaje del pedido...
```

El cliente hace clic en "Enviar por WhatsApp" y el mensaje llega directamente al dueño.

**Limitación:** el cliente debe presionar "Enviar" en WhatsApp manualmente.

---

### Opción profesional — Meta Cloud API (WhatsApp Business)

**Costo:** ~$0.05–$0.08 USD por conversación iniciada por negocio (MX).
Conversaciones iniciadas por usuario (cliente): **gratis** las primeras 24h.

**Pasos para activar:**

1. Crear cuenta en [Meta for Developers](https://developers.facebook.com/)
2. Crear una app → "Business" → WhatsApp
3. Vincular número de teléfono
4. Obtener `WHATSAPP_TOKEN` y `PHONE_NUMBER_ID`
5. Instalar: `npm install axios` (ya incluido en el proyecto)
6. En `ordersController.js`, agregar al final de `createOrder`:

```javascript
// Envío automático via Meta API
await axios.post(
  `https://graph.facebook.com/v19.0/${process.env.WA_PHONE_ID}/messages`,
  {
    messaging_product: 'whatsapp',
    to: process.env.OWNER_WHATSAPP,
    type: 'text',
    text: { body: mensajeDelPedido },
  },
  { headers: { Authorization: `Bearer ${process.env.WA_TOKEN}` } }
);
```

**Ventaja:** El mensaje llega automáticamente al dueño sin que el cliente haga nada.

---

## Personalización

### Cambiar nombre del negocio
- `client/index.html` → `<title>`
- `client/src/components/Navbar.jsx` → nombre y slogan
- `client/src/components/Hero.jsx` → textos del banner
- `server/.env` → `OWNER_NAME`

### Cambiar colores
En `client/tailwind.config.js` → sección `colors.brand`, modifica los valores hex.
Los colores actuales son naranja/ámbar (#f97316 como primario).

### Agregar productos
- Desde pgAdmin: INSERT en la tabla `products`
- O agrega una ruta admin de gestión de productos (extensión futura)

### Cargo por envío
En `server/src/controllers/ordersController.js`, línea:
```javascript
const delivery_fee = 0;  // Cambia a: const delivery_fee = 30;
```

---

## Comandos rápidos

```bash
# Servidor (desde /server)
npm run dev          # Desarrollo
npm start            # Producción
npm run setup-admin  # Crear/actualizar admin

# Cliente (desde /client)
npm run dev          # Desarrollo
npm run build        # Compilar para producción
npm run preview      # Previsualizar build
```

---

## Solución de problemas

**Error: "password authentication failed for user postgres"**
→ Verifica `DB_PASSWORD` en `server/.env`

**Error: "ECONNREFUSED 127.0.0.1:5432"**
→ Asegúrate de que PostgreSQL esté corriendo. En Windows: Servicios → postgresql → Iniciar

**La app no carga productos**
→ Verifica que el servidor esté corriendo en puerto 4000 y que hayas ejecutado seed.sql

**El carrito no guarda al recargar**
→ Normal. El carrito vive en memoria (React state). Se puede persistir en localStorage como mejora futura.
