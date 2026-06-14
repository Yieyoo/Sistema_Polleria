require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const productsRouter = require('./routes/products');
const ordersRouter  = require('./routes/orders');
const adminRouter   = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middlewares globales ──────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Rate limiting general
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Demasiadas solicitudes. Intenta más tarde.' },
}));

// Rate limiting estricto para creación de pedidos
const orderLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Demasiados pedidos. Espera un momento.' },
});

// ── Rutas ─────────────────────────────────────────────────────
app.use('/api/products',  productsRouter);
app.use('/api/orders',    orderLimiter, ordersRouter);
app.use('/api/admin',     adminRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Arranque ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🍗 Servidor Pollería corriendo en http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
});
