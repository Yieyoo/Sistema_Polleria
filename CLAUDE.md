# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Online ordering system for a poultry restaurant ("polleria") with a customer-facing storefront and an admin panel. The project is a monorepo with two independent apps: a React frontend (`client/`) and a Node.js/Express REST API (`server/`).

## Commands

### Server (`cd server` first)
```bash
npm run dev          # Development with nodemon auto-reload
npm start            # Production
npm run setup-admin  # Interactive CLI to create/update the admin user
```

### Client (`cd client` first)
```bash
npm run dev          # Dev server at http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview the production build locally
```

### Database (run once, from project root)
```bash
psql -U postgres -d polleria_db -f database/schema.sql
psql -U postgres -d polleria_db -f database/seed.sql
```

## Architecture

### Frontend (`client/src/`)
- **Pages:** `Home` (public storefront), `Admin` (order dashboard), `AdminLogin`
- **State:** Cart lives in `CartContext` using `useReducer` — it is in-memory only and resets on page reload
- **API layer:** `services/api.js` is the single place all HTTP calls are made via Axios. It has a **mock mode** (`USE_MOCK = true`) that intercepts all calls and returns static data from `services/mockData.js`, allowing the frontend to run without a backend
- **Auth:** JWT token stored in `localStorage` under `admin_token`. The Axios interceptor in `api.js` attaches it to every request and auto-redirects to `/admin/login` on 401
- **Routing:** React Router v6. `PrivateRoute` in `App.jsx` guards `/admin` by checking `localStorage` for the token
- **Proxy:** Vite proxies `/api/*` to `http://localhost:4000` in development, so the client uses relative `/api` paths everywhere

### Backend (`server/src/`)
- **Entry point:** `src/index.js` — registers middleware, routes, rate limiters, and global error handler
- **Database:** Single `pg.Pool` instance exported from `config/database.js`, imported directly in controllers — there is no ORM
- **Auth middleware:** `middleware/auth.js` exports `requireAuth`, which verifies the JWT and attaches the decoded payload to `req.admin`
- **Rate limiting:** Two tiers — 200 req/15 min globally, and a stricter 10 req/min on `POST /api/orders`
- **WhatsApp:** Order creation generates a pre-filled `wa.me` deep link returned in the API response. The client displays it as a button; the customer must tap "Send" manually. See `ordersController.js` `buildWhatsAppLink` to swap this for the Meta Cloud API

### Database schema (PostgreSQL 14+)
Five tables: `categories`, `products`, `orders`, `order_items`, `admin_users`. Order status flow is enforced by a DB CHECK constraint: `pendiente -> preparando -> en_camino -> entregado | cancelado`. `updated_at` is maintained by triggers on `products` and `orders`.

## Key configuration

### Switching from mock to real backend
In `client/src/services/api.js`, set `USE_MOCK = false`. Requires the server running and the database populated.

### Server environment (`server/.env`)
Copy `server/.env.example` to `server/.env`. Required variables:
- `DB_PASSWORD` — PostgreSQL password
- `JWT_SECRET` — change from default before any real deployment
- `OWNER_WHATSAPP` — format `521XXXXXXXXXX` (Mexico: 52 + 1 + 10 digits)
- `CLIENT_URL` — frontend origin for CORS (default `http://localhost:5173`)

### Brand customization
- Colors: `client/tailwind.config.js` under `colors.brand` (current primary: `#f97316` orange/amber)
- Business name: `client/index.html` title, `Navbar.jsx`, `Hero.jsx`, and `server/.env` `OWNER_NAME`
- Delivery fee: hardcoded `const delivery_fee = 0` in `ordersController.js`

## Deployment

The frontend deploys to Vercel as a static SPA. The root `vercel.json` sets `buildCommand: "cd client && npm install && npx vite build"` and `client/vercel.json` adds SPA rewrites (`/* -> /index.html`). The backend is not deployed to Vercel and requires a separate host (e.g., Railway, Render). In production, `CLIENT_URL` on the server and the Axios `baseURL` on the client must be updated to match real domains.
