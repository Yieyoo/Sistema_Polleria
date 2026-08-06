// ─────────────────────────────────────────────
// CATEGORÍAS — El Pollito Gus
// ─────────────────────────────────────────────
export const CATEGORIES = [
  // Pollo Fresco
  { id: 1,  name: 'Pechuga de Pollo',  description: 'Elige cuántas pechugas y en qué presentación', emoji: '🫀', sort_order: 1 },
  { id: 2,  name: 'Pierna y Muslo',    description: 'Arma tu combinado a la medida', emoji: '🍗', sort_order: 2 },
  { id: 10, name: 'Alitas de Pollo',   description: 'Alitas solas, frescas y de calidad',         emoji: '🐔', sort_order: 3 },
  { id: 11, name: 'Retazo de Pollo',   description: 'Con alas o sin alas, precio por kg',         emoji: '🐓', sort_order: 5 },
  // Especialidades (acordeón)
  { id: 12, name: 'Especialidades', description: 'Nuggets · Palomitas · Tenders · Boneless · Papas y más', emoji: '🔥', sort_order: 6 },
  // Solo Charolas en tab
  { id: 9, name: 'Charolas',          description: 'Combos para compartir',              emoji: '🫕', sort_order: 8 },
];

// ─────────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────────
export const PRODUCTS = [

  // ══ PECHUGA DE POLLO — solo selector (sin productos sueltos) ══

  // ══ PIERNA Y MUSLO — solo combinado (sin productos sueltos) ══

  // ══ ALITAS DE POLLO ═══════════════════════
  {
    id: 15, category_id: 10, category_name: 'Alitas de Pollo', category_emoji: '🐔',
    name: 'Alitas de Pollo',
    description: 'Alitas solas, frescas de pollo amarillo. Precio por kg.',
    price: '00.00',
    image_url: '/fotos/alitas.jpg',
    available: true, sort_order: 1,
  },

  // ══ RETAZO DE POLLO ═══════════════════════
  {
    id: 32, category_id: 11, category_name: 'Retazo de Pollo', category_emoji: '🐓',
    name: 'Retazo con Alas',
    description: 'Retazo de pollo fresco con alas incluidas. Ideal para caldos y guisos.',
    price: '00.00',
    image_url: '/fotos/retazo.jpg',
    available: true, sort_order: 1,
  },
  {
    id: 33, category_id: 11, category_name: 'Retazo de Pollo', category_emoji: '🐓',
    name: 'Retazo sin Alas',
    description: 'Retazo de pollo fresco sin alas. Perfecto para sopas y caldos.',
    price: '00.00',
    image_url: '/fotos/retazo.jpg',
    available: true, sort_order: 2,
  },

  // ══ BONELESS ══════════════════════════════
  {
    id: 16, category_id: 4, category_name: 'Boneless', category_emoji: '🔥',
    name: 'Boneless Natural',
    description: 'Trozos de pollo sin hueso, empanizados y fritos. Sabor original crujiente.',
    price: '80.00',
    image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80',
    available: true, sort_order: 1,
  },
  {
    id: 17, category_id: 4, category_name: 'Boneless', category_emoji: '🔥',
    name: 'Boneless Limón',
    description: 'Boneless bañados en salsa de limón con un toque picosito.',
    price: '80.00',
    image_url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&q=80',
    available: true, sort_order: 2,
  },
  {
    id: 18, category_id: 4, category_name: 'Boneless', category_emoji: '🔥',
    name: 'Boneless Buffalo',
    description: 'Boneless con salsa buffalo picante y ahumada. Para los valientes.',
    price: '85.00',
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',
    available: true, sort_order: 3,
  },

  // ══ NUGGETS & PALOMITAS ════════════════════
  {
    id: 19, category_id: 5, category_name: 'Nuggets & Palomitas', category_emoji: '⭐',
    name: 'Nuggets de Pollo',
    description: 'Nuggets de pollo 100% pechuga, crujientes por fuera y jugosos por dentro.',
    price: '70.00',
    image_url: 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80',
    available: true, sort_order: 1,
  },
  {
    id: 20, category_id: 5, category_name: 'Nuggets & Palomitas', category_emoji: '⭐',
    name: 'Palomitas de Pollo',
    description: 'Pequeños bocados de pollo empanizado, perfectos para botanear.',
    price: '70.00',
    image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=500&q=80',
    available: true, sort_order: 2,
  },

  // ══ TENDERS ═══════════════════════════════
  {
    id: 21, category_id: 6, category_name: "Tender's", category_emoji: '🍖',
    name: "Tender's Natural",
    description: 'Tiras de pechuga empanizadas, crujientes y jugosas.',
    price: '90.00',
    image_url: 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',
    available: true, sort_order: 1,
  },
  {
    id: 22, category_id: 6, category_name: "Tender's", category_emoji: '🍖',
    name: "Tender's Limón",
    description: 'Tiras de pollo bañadas en salsa de limón con chile.',
    price: '90.00',
    image_url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&q=80',
    available: true, sort_order: 2,
  },
  {
    id: 23, category_id: 6, category_name: "Tender's", category_emoji: '🍖',
    name: "Tender's Buffalo",
    description: 'Tiras de pollo con salsa buffalo picante.',
    price: '95.00',
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',
    available: true, sort_order: 3,
  },

  // ══ PAPAS ═════════════════════════════════
  {
    id: 24, category_id: 7, category_name: 'Papas', category_emoji: '🍟',
    name: 'Papa Gajo',
    description: 'Gajos de papa sazonados, crujientes por fuera y suaves por dentro.',
    price: '45.00',
    image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80',
    available: true, sort_order: 1,
  },
  {
    id: 25, category_id: 7, category_name: 'Papas', category_emoji: '🍟',
    name: 'Papa Recta',
    description: 'Papas fritas clásicas estilo francés, bien doradas y crujientes.',
    price: '40.00',
    image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80',
    available: true, sort_order: 2,
  },

  // ══ EMPANADAS & BURGER ════════════════════
  {
    id: 26, category_id: 8, category_name: 'Empanadas & Burger', category_emoji: '🍔',
    name: 'Empanada de Pollo',
    description: 'Empanada rellena de pollo deshebrado con condimentos especiales.',
    price: '35.00',
    image_url: 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80',
    available: true, sort_order: 1,
  },
  {
    id: 27, category_id: 8, category_name: 'Empanadas & Burger', category_emoji: '🍔',
    name: 'Empanadas x3',
    description: '3 empanadas de pollo. La porción perfecta.',
    price: '95.00',
    image_url: 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80',
    available: true, sort_order: 2,
  },
  {
    id: 28, category_id: 8, category_name: 'Empanadas & Burger', category_emoji: '🍔',
    name: 'Hamburguesa de Pollo',
    description: 'Filete de pollo empanizado con lechuga, tomate y aderezo en pan brioche.',
    price: '95.00',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    available: true, sort_order: 3,
  },

  // ══ ESPECIALIDADES ════════════════════════
  { id: 34, category_id: 12, category_name: 'Especialidades', category_emoji: '🔥',
    name: 'Nuggets de Pollo', short_name: 'Nuggets', group: null, unit: '250 g aprox.',
    description: '100% pechuga, crujientes por fuera y jugosos por dentro.',
    price: '70.00', image_url: 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80',
    available: true, sort_order: 1 },
  { id: 35, category_id: 12, category_name: 'Especialidades', category_emoji: '🔥',
    name: 'Palomitas de Pollo', short_name: 'Palomitas de Pollo', group: null, unit: '250 g aprox.',
    description: 'Pequeños bocados de pollo empanizado.',
    price: '70.00', image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=500&q=80',
    available: true, sort_order: 2 },
  { id: 42, category_id: 12, category_name: 'Especialidades', category_emoji: '🔥',
    name: 'Empanadas', short_name: 'Empanadas', group: null, unit: 'charola (4 pza)',
    description: 'Empanadas rellenas de pollo deshebrado.',
    price: '95.00', image_url: 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80',
    available: true, sort_order: 3 },
  { id: 43, category_id: 12, category_name: 'Especialidades', category_emoji: '🔥',
    name: 'Hamburguesa de Pollo', short_name: 'Hamburguesa', group: null, unit: 'charola (4 pza)',
    description: 'Filete empanizado con lechuga, tomate y aderezo.',
    price: '95.00', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    available: true, sort_order: 4 },
  { id: 36, category_id: 12, category_name: 'Especialidades', category_emoji: '🔥',
    name: 'Tenders Natural', short_name: 'Natural', group: 'Tenders', unit: '250 g aprox.',
    description: 'Tiras de pechuga empanizadas, crujientes y jugosas.',
    price: '90.00', image_url: 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',
    available: true, sort_order: 5 },
  { id: 38, category_id: 12, category_name: 'Especialidades', category_emoji: '🔥',
    name: 'Tenders Buffalo', short_name: 'Buffalo 🔥', group: 'Tenders', unit: '250 g aprox.',
    description: 'Tiras de pollo con salsa buffalo picante.',
    price: '95.00', image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',
    available: true, sort_order: 6 },
  { id: 39, category_id: 12, category_name: 'Especialidades', category_emoji: '🔥',
    name: 'Boneless Natural', short_name: 'Natural', group: 'Boneless', unit: '250 g aprox.',
    description: 'Pollo sin hueso empanizado, sabor original crujiente.',
    price: '80.00', image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80',
    available: true, sort_order: 7 },
  { id: 41, category_id: 12, category_name: 'Especialidades', category_emoji: '🔥',
    name: 'Boneless Buffalo', short_name: 'Buffalo 🔥', group: 'Boneless', unit: '250 g aprox.',
    description: 'Boneless con salsa buffalo picante y ahumada.',
    price: '85.00', image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',
    available: true, sort_order: 8 },

  // ══ PAPAS ═════════════════════════════════
  { id: 44, category_id: 12, category_name: 'Especialidades', category_emoji: '🔥',
    name: 'Papa Gajo', short_name: 'Gajo', group: 'Papas', unit: 'porción',
    description: 'Gajos de papa sazonados, crujientes por fuera.',
    price: '45.00', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80',
    available: true, sort_order: 11 },
  { id: 45, category_id: 12, category_name: 'Especialidades', category_emoji: '🔥',
    name: 'Papa Recta', short_name: 'Recta', group: 'Papas', unit: 'porción',
    description: 'Papas fritas clásicas bien doradas.',
    price: '40.00', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80',
    available: true, sort_order: 12 },

  // ══ CHAROLAS ══════════════════════════════
  {
    id: 29, category_id: 9, category_name: 'Charolas', category_emoji: '🫕',
    name: 'Charola Chica',
    description: 'Nuggets + palomitas + papas + 1 refresco. Para 1-2 personas.',
    price: '130.00',
    image_url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&q=80',
    available: true, sort_order: 1,
  },
  {
    id: 30, category_id: 9, category_name: 'Charolas', category_emoji: '🫕',
    name: 'Charola Mediana',
    description: 'Boneless + nuggets + papas gajo + 2 refrescos. Para 2-3 personas.',
    price: '220.00',
    image_url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&q=80',
    available: true, sort_order: 2,
  },
  {
    id: 31, category_id: 9, category_name: 'Charolas', category_emoji: '🫕',
    name: 'Charola Grande',
    description: 'Boneless + tenders + nuggets + palomitas + papas + 4 refrescos.',
    price: '390.00',
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',
    available: true, sort_order: 3,
  },
];

// ─────────────────────────────────────────────
// MOCK ORDER
// ─────────────────────────────────────────────
const makeOrderNum = () => {
  const d  = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `PG-${yy}${mm}${dd}-${Math.floor(Math.random() * 9000) + 1000}`;
};

export const mockCreateOrder = (data) => {
  const subtotal    = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const orderNumber = makeOrderNum();
  const payIcon     = data.payment_method === 'efectivo' ? '💵 Efectivo' : '💳 Tarjeta/Transferencia';

  const itemLines = data.items
    .map(i => `  • ${i.quantity}x ${i.name}  $${(i.price * i.quantity).toFixed(2)}`)
    .join('\n');

  const msg =
    `🐔 *NUEVO PEDIDO ${orderNumber}*\n\n` +
    `👤 *Cliente:* ${data.customer_name}\n` +
    `📱 *Teléfono:* ${data.customer_phone}\n` +
    `📍 *Dirección:* ${data.customer_address}\n` +
    `📌 *Referencias:* ${data.customer_references || 'Sin referencias'}\n\n` +
    `🛒 *PRODUCTOS:*\n${itemLines}\n\n` +
    `💵 *TOTAL: $${subtotal.toFixed(2)}*\n` +
    `💳 *Pago:* ${payIcon}\n` +
    (data.notes ? `📝 *Notas:* ${data.notes}\n` : '') +
    `\n_Por favor confirmar el pedido_`;

  return {
    success: true,
    order: {
      id: Math.floor(Math.random() * 1000) + 1,
      order_number:        orderNumber,
      customer_name:       data.customer_name,
      customer_phone:      data.customer_phone,
      customer_address:    data.customer_address,
      customer_references: data.customer_references || '',
      payment_method:      data.payment_method,
      subtotal,
      delivery_fee: 0,
      total:        subtotal,
      status:       'pendiente',
      notes:        data.notes || '',
      created_at:   new Date().toISOString(),
      items:        data.items,
    },
    whatsapp_link: `https://wa.me/521XXXXXXXXXX?text=${encodeURIComponent(msg)}`,
  };
};
