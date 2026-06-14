const pool = require('../config/database');

// Genera un número de pedido único: PO-260609-4821
const makeOrderNumber = () => {
  const d   = new Date();
  const yy  = String(d.getFullYear()).slice(-2);
  const mm  = String(d.getMonth() + 1).padStart(2, '0');
  const dd  = String(d.getDate()).padStart(2, '0');
  const rnd = Math.floor(Math.random() * 9000) + 1000;
  return `PO-${yy}${mm}${dd}-${rnd}`;
};

const buildWhatsAppLink = (order, items) => {
  const phone = (process.env.OWNER_WHATSAPP || '521XXXXXXXXXX').replace(/\D/g, '');

  const itemLines = items
    .map(i => `  • ${i.quantity}x ${i.name}  $${(+i.price * +i.quantity).toFixed(2)}`)
    .join('\n');

  const payIcon = order.payment_method === 'efectivo' ? '💵 Efectivo' : '🏦 Transferencia';

  const msg =
    `🍗 *NUEVO PEDIDO ${order.order_number}*\n\n` +
    `👤 *Cliente:* ${order.customer_name}\n` +
    `📱 *Teléfono:* ${order.customer_phone}\n` +
    `📍 *Dirección:* ${order.customer_address}\n` +
    `📌 *Referencias:* ${order.customer_references || 'Sin referencias'}\n\n` +
    `🛒 *PRODUCTOS:*\n${itemLines}\n\n` +
    `💰 *Subtotal:* $${(+order.subtotal).toFixed(2)}\n` +
    `🚚 *Envío:* $${(+order.delivery_fee).toFixed(2)}\n` +
    `💵 *TOTAL: $${(+order.total).toFixed(2)}*\n\n` +
    `💳 *Pago:* ${payIcon}\n` +
    (order.notes ? `📝 *Notas:* ${order.notes}\n` : '') +
    `\n_Por favor confirmar el pedido_`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
};

const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      customer_name, customer_phone, customer_address,
      customer_references, payment_method, items, notes,
    } = req.body;

    // Validación básica
    if (!customer_name?.trim() || !customer_phone?.trim() ||
        !customer_address?.trim() || !payment_method || !items?.length) {
      return res.status(400).json({ error: 'Faltan datos obligatorios del pedido.' });
    }
    if (!['efectivo', 'transferencia'].includes(payment_method)) {
      return res.status(400).json({ error: 'Forma de pago inválida.' });
    }

    // Calcular totales
    const subtotal    = items.reduce((s, i) => s + (+i.price * +i.quantity), 0);
    const delivery_fee = 0;
    const total       = subtotal + delivery_fee;

    await client.query('BEGIN');

    // Número único de pedido
    let order_number, attempts = 0;
    do {
      order_number = makeOrderNumber();
      const { rows } = await client.query('SELECT id FROM orders WHERE order_number=$1', [order_number]);
      if (!rows.length) break;
    } while (++attempts < 10);

    const { rows: [order] } = await client.query(
      `INSERT INTO orders
         (order_number, customer_name, customer_phone, customer_address,
          customer_references, payment_method, subtotal, delivery_fee, total, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [order_number, customer_name.trim(), customer_phone.trim(),
       customer_address.trim(), customer_references?.trim() || null,
       payment_method, subtotal, delivery_fee, total, notes?.trim() || null]
    );

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
           (order_id, product_id, product_name, product_price, quantity, item_total)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [order.id, item.product_id || null, item.name,
         +item.price, +item.quantity, +item.price * +item.quantity]
      );
    }

    await client.query('COMMIT');

    const whatsapp_link = buildWhatsAppLink(order, items);
    res.status(201).json({ success: true, order: { ...order, items }, whatsapp_link });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('createOrder:', err.message);
    res.status(500).json({ error: 'Error al procesar el pedido. Intenta nuevamente.' });
  } finally {
    client.release();
  }
};

module.exports = { createOrder };
