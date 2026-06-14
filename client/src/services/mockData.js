// ─────────────────────────────────────────────
// CATEGORÍAS — El Pollito Gus
// ─────────────────────────────────────────────
export const CATEGORIES = [
  // Pollo Fresco
  { id: 1, name: 'Pechuga de Pollo',  description: 'Preparada a tu gusto',              emoji: '🫀', sort_order: 1 },
  { id: 2, name: 'Pierna y Muslo',    description: 'Fajitas, alambre, bistec y más',    emoji: '🍗', sort_order: 2 },
  { id: 3, name: 'Alitas de Pollo',   description: 'Frescas y de calidad',              emoji: '🐔', sort_order: 3 },
  // Preparados
  { id: 4, name: 'Boneless',          description: 'Natural · Limón · Buffalo',          emoji: '🔥', sort_order: 4 },
  { id: 5, name: 'Nuggets & Palomitas', description: 'Crujientes y deliciosos',          emoji: '⭐', sort_order: 5 },
  { id: 6, name: "Tender's",          description: 'Tiras de pollo empanizadas',         emoji: '🍖', sort_order: 6 },
  { id: 7, name: 'Papas',             description: 'Papa Gajo y Papa Recta',             emoji: '🍟', sort_order: 7 },
  { id: 8, name: 'Empanadas & Burger',description: 'Empanadas y Hamburguesas',           emoji: '🍔', sort_order: 8 },
  { id: 9, name: 'Charolas',          description: 'Combos para compartir',              emoji: '🫕', sort_order: 9 },
];

// ─────────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────────
export const PRODUCTS = [

  // ══ PECHUGA DE POLLO ══════════════════════
  {
    id: 1, category_id: 1, category_name: 'Pechuga de Pollo', category_emoji: '🫀',
    name: 'Pechuga — 4 Bisteces',
    description: 'Pechuga fresca en 4 bisteces. Lista para cocer a tu gusto.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80',
    available: true, sort_order: 1,
  },
  {
    id: 2, category_id: 1, category_name: 'Pechuga de Pollo', category_emoji: '🫀',
    name: 'Pechuga — 6 Bisteces',
    description: 'Pechuga fresca en 6 bisteces. Lista para cocer a tu gusto.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80',
    available: true, sort_order: 2,
  },
  {
    id: 3, category_id: 1, category_name: 'Pechuga de Pollo', category_emoji: '🫀',
    name: 'Pechuga — 8 Bisteces',
    description: 'Pechuga fresca en 8 bisteces. Lista para cocer a tu gusto.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80',
    available: true, sort_order: 3,
  },
  {
    id: 4, category_id: 1, category_name: 'Pechuga de Pollo', category_emoji: '🫀',
    name: 'Pechuga — 10 Bisteces',
    description: 'Pechuga fresca en 10 bisteces. Lista para cocer a tu gusto.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80',
    available: true, sort_order: 4,
  },
  {
    id: 5, category_id: 1, category_name: 'Pechuga de Pollo', category_emoji: '🫀',
    name: 'Pechuga en Fajitas',
    description: 'Pechuga fresca cortada en fajitas. Ideal para tacos y platillos.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80',
    available: true, sort_order: 5,
  },
  {
    id: 6, category_id: 1, category_name: 'Pechuga de Pollo', category_emoji: '🫀',
    name: 'Pechuga para Alambre',
    description: 'Pechuga fresca cortada para alambre. Cuadritos perfectos.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80',
    available: true, sort_order: 6,
  },
  {
    id: 7, category_id: 1, category_name: 'Pechuga de Pollo', category_emoji: '🫀',
    name: 'Pechuga Molida',
    description: 'Pechuga de pollo molida fresca. Lista para guisos y rellenos.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80',
    available: true, sort_order: 7,
  },
  {
    id: 8, category_id: 1, category_name: 'Pechuga de Pollo', category_emoji: '🫀',
    name: 'Pechuga para Cocer (entera)',
    description: 'Pechuga entera fresca para cocer. Perfecta para caldos y hervidos.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80',
    available: true, sort_order: 8,
  },

  // ══ PIERNA Y MUSLO ════════════════════════
  {
    id: 9, category_id: 2, category_name: 'Pierna y Muslo', category_emoji: '🍗',
    name: 'Pierna y Muslo — Piezas Enteras',
    description: 'Pierna y muslo frescos, piezas enteras. Pollo amarillo de primera.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',
    available: true, sort_order: 1,
  },
  {
    id: 10, category_id: 2, category_name: 'Pierna y Muslo', category_emoji: '🍗',
    name: 'Pierna y Muslo — Bistec',
    description: 'Pierna y muslo abiertos en bistec. Listos para la sartén o asador.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',
    available: true, sort_order: 2,
  },
  {
    id: 11, category_id: 2, category_name: 'Pierna y Muslo', category_emoji: '🍗',
    name: 'Pierna y Muslo — Fajitas',
    description: 'Pierna y muslo cortados en fajitas. Perfectos para tacos y guisos.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',
    available: true, sort_order: 3,
  },
  {
    id: 12, category_id: 2, category_name: 'Pierna y Muslo', category_emoji: '🍗',
    name: 'Pierna y Muslo — Alambre',
    description: 'Pierna y muslo en cubos para alambre. Sabor inigualable.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',
    available: true, sort_order: 4,
  },
  {
    id: 13, category_id: 2, category_name: 'Pierna y Muslo', category_emoji: '🍗',
    name: 'Molidos de Pierna y Muslo',
    description: 'Pierna y muslo molidos frescos. Ideal para albóndigas y rellenos.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',
    available: true, sort_order: 5,
  },

  // ══ ALITAS DE POLLO ═══════════════════════
  {
    id: 14, category_id: 3, category_name: 'Alitas de Pollo', category_emoji: '🐔',
    name: 'Alitas de Pollo',
    description: 'Alitas frescas de pollo amarillo. Perfectas para asar, freír o guisar.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',
    available: true, sort_order: 1,
  },
  {
    id: 15, category_id: 3, category_name: 'Alitas de Pollo', category_emoji: '🐔',
    name: 'Piernas de Pollo',
    description: 'Piernas frescas de pollo amarillo. Calidad garantizada.',
    price: '00.00',
    image_url: 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',
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
