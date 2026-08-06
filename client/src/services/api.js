import { supabase } from './supabase.js';

// ── Categorías ─────────────────────────────────────────────────
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return { data };
};

// ── Productos ──────────────────────────────────────────────────
export const getProducts = async (categoryId) => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .order('sort_order');
  if (categoryId) query = query.eq('category_id', categoryId);
  const { data, error } = await query;
  if (error) throw error;
  // map group_name → group para compatibilidad con los componentes existentes
  return { data: data.map(p => ({ ...p, group: p.group_name })) };
};

// ── Crear pedido ───────────────────────────────────────────────
export const createOrder = async (orderData) => {
  const orderNumber = makeOrderNum();
  const subtotal = orderData.items.reduce((s, i) => s + i.price * i.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number:        orderNumber,
      customer_name:       orderData.customer_name,
      customer_phone:      orderData.customer_phone,
      customer_address:    orderData.customer_address,
      customer_references: orderData.customer_references || '',
      payment_method:      orderData.payment_method,
      subtotal,
      delivery_fee: 0,
      total: subtotal,
      status: 'pendiente',
      notes: orderData.notes || '',
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      orderData.items.map(i => ({
        order_id:     order.id,
        product_id:   typeof i.id === 'number' ? i.id : null,
        product_name: i.name,
        quantity:     i.quantity,
        unit_price:   i.price,
        item_total:   i.price * i.quantity,
      }))
    );

  if (itemsError) throw itemsError;

  const payIcon  = orderData.payment_method === 'efectivo' ? '💵 Efectivo' : '💳 Tarjeta';
  const itemLines = orderData.items
    .map(i => `  • ${i.quantity}x ${i.name}  $${(i.price * i.quantity).toFixed(2)}`)
    .join('\n');

  const msg =
    `🐔 *NUEVO PEDIDO ${orderNumber}*\n\n` +
    `👤 *Cliente:* ${orderData.customer_name}\n` +
    `📱 *Teléfono:* ${orderData.customer_phone}\n` +
    `📍 *Dirección:* ${orderData.customer_address}\n` +
    `📌 *Referencias:* ${orderData.customer_references || 'Sin referencias'}\n\n` +
    `🛒 *PRODUCTOS:*\n${itemLines}\n\n` +
    `💵 *TOTAL: $${subtotal.toFixed(2)}*\n` +
    `💳 *Pago:* ${payIcon}\n` +
    (orderData.notes ? `📝 *Notas:* ${orderData.notes}\n` : '') +
    `\n_Por favor confirmar el pedido_`;

  return {
    data: {
      success: true,
      order: { ...order, items: orderData.items },
      whatsapp_link: `https://wa.me/521XXXXXXXXXX?text=${encodeURIComponent(msg)}`,
    },
  };
};

// ── Admin: login ───────────────────────────────────────────────
export const adminLogin = async ({ username, password }) => {
  const email = username.includes('@') ? username : `${username}@pollitogus.com`;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw { response: { data: { error: 'Credenciales incorrectas.' } } };
  const user = data.user;
  localStorage.setItem('admin_token', data.session.access_token);
  localStorage.setItem('admin_user', JSON.stringify({
    username: user.email,
    full_name: user.user_metadata?.full_name || 'Administrador',
  }));
  return { data: { token: data.session.access_token, username: user.email, full_name: user.user_metadata?.full_name || 'Administrador' } };
};

// ── Admin: pedidos ─────────────────────────────────────────────
export const getOrders = async ({ page = 1, limit = 20, status, date } = {}) => {
  let query = supabase
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (status) query = query.eq('status', status);
  if (date) {
    query = query
      .gte('created_at', `${date}T00:00:00`)
      .lte('created_at', `${date}T23:59:59`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const orders = (data || []).map(o => ({
    ...o,
    items: o.order_items || [],
  }));

  return { data: { orders, total: count || 0 } };
};

export const updateStatus = async (orderId, status) => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (error) throw error;
  return { data: { success: true } };
};

export const getDailySummary = async (date = new Date().toISOString().split('T')[0]) => {
  const { data, error } = await supabase
    .from('orders')
    .select('status, total')
    .gte('created_at', `${date}T00:00:00`)
    .lte('created_at', `${date}T23:59:59`);

  if (error) throw error;

  return {
    data: {
      total_orders:  data.length,
      pending:       data.filter(o => o.status === 'pendiente').length,
      preparing:     data.filter(o => o.status === 'preparando').length,
      on_the_way:    data.filter(o => o.status === 'en_camino').length,
      delivered:     data.filter(o => o.status === 'entregado').length,
      cancelled:     data.filter(o => o.status === 'cancelado').length,
      total_revenue: data
        .filter(o => o.status !== 'cancelado')
        .reduce((s, o) => s + parseFloat(o.total || 0), 0),
    },
  };
};

// ── Helpers ────────────────────────────────────────────────────
function makeOrderNum() {
  const d  = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `PG-${yy}${mm}${dd}-${Math.floor(Math.random() * 9000) + 1000}`;
}
