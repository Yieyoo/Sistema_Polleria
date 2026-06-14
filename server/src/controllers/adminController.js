const pool    = require('../config/database');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'polleria_secret_key_dev';

// ── Autenticación ──────────────────────────────────────────────
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos.' });

  try {
    const { rows } = await pool.query(
      'SELECT * FROM admin_users WHERE username = $1 AND active = true',
      [username.trim().toLowerCase()]
    );
    if (!rows.length)
      return res.status(401).json({ error: 'Credenciales incorrectas.' });

    const user    = rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid)
      return res.status(401).json({ error: 'Credenciales incorrectas.' });

    await pool.query('UPDATE admin_users SET last_login=NOW() WHERE id=$1', [user.id]);

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, username: user.username, full_name: user.full_name });
  } catch (err) {
    console.error('login:', err.message);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

// ── Listado de pedidos con filtros ──────────────────────────────
const getOrders = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 30 } = req.query;
    const offset = (Math.max(1, +page) - 1) * +limit;
    const params = [];
    const conds  = [];
    let   pi     = 1;

    if (status) { conds.push(`o.status = $${pi++}`); params.push(status); }
    if (date)   { conds.push(`DATE(o.created_at) = $${pi++}`); params.push(date); }

    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

    const dataSQL = `
      SELECT o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id',            oi.id,
              'product_name',  oi.product_name,
              'product_price', oi.product_price,
              'quantity',      oi.quantity,
              'item_total',    oi.item_total
            ) ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${where}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${pi} OFFSET $${pi + 1}
    `;
    const countSQL = `SELECT COUNT(*) FROM orders o ${where}`;

    const [dataRes, countRes] = await Promise.all([
      pool.query(dataSQL, [...params, +limit, offset]),
      pool.query(countSQL, params),
    ]);

    res.json({
      orders: dataRes.rows,
      total:  +countRes.rows[0].count,
      page:   +page,
      limit:  +limit,
    });
  } catch (err) {
    console.error('getOrders:', err.message);
    res.status(500).json({ error: 'Error al obtener pedidos.' });
  }
};

// ── Actualizar estado del pedido ───────────────────────────────
const updateStatus = async (req, res) => {
  const VALID = ['pendiente', 'preparando', 'en_camino', 'entregado', 'cancelado'];
  const { status } = req.body;
  const { id }     = req.params;

  if (!VALID.includes(status))
    return res.status(400).json({ error: 'Estado inválido.' });

  try {
    const { rows } = await pool.query(
      'UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Pedido no encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('updateStatus:', err.message);
    res.status(500).json({ error: 'Error al actualizar pedido.' });
  }
};

// ── Resumen del día ────────────────────────────────────────────
const getDailySummary = async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)                                                              AS total_orders,
        COUNT(*) FILTER (WHERE status = 'pendiente')                         AS pending,
        COUNT(*) FILTER (WHERE status = 'preparando')                        AS preparing,
        COUNT(*) FILTER (WHERE status = 'en_camino')                         AS on_the_way,
        COUNT(*) FILTER (WHERE status = 'entregado')                         AS delivered,
        COUNT(*) FILTER (WHERE status = 'cancelado')                         AS cancelled,
        COALESCE(SUM(total) FILTER (WHERE status != 'cancelado'), 0)         AS total_revenue,
        COALESCE(SUM(total) FILTER (WHERE status  = 'entregado'), 0)         AS confirmed_revenue
      FROM orders
      WHERE DATE(created_at) = $1
    `, [date]);
    res.json(rows[0]);
  } catch (err) {
    console.error('getDailySummary:', err.message);
    res.status(500).json({ error: 'Error al obtener resumen.' });
  }
};

module.exports = { login, getOrders, updateStatus, getDailySummary };
