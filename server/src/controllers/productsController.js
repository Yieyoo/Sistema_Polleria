const pool = require('../config/database');

const getCategories = async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE active = true ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getCategories:', err.message);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category_id } = req.query;
    const params = [];
    let where = 'WHERE p.available = true';

    if (category_id) {
      params.push(parseInt(category_id));
      where += ` AND p.category_id = $${params.length}`;
    }

    const result = await pool.query(
      `SELECT p.*, c.name AS category_name, c.emoji AS category_emoji
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${where}
       ORDER BY p.sort_order ASC, p.name ASC`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getProducts:', err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Admin: incluir todos (incluso no disponibles)
const getAllProducts = async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY c.sort_order ASC, p.sort_order ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getAllProducts:', err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const toggleProductAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE products SET available = NOT available WHERE id = $1 RETURNING *',
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('toggleProductAvailability:', err.message);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

module.exports = { getCategories, getProducts, getAllProducts, toggleProductAvailability };
