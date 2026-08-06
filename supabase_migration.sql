-- ═══════════════════════════════════════════════════
-- El Pollito Gus — Migración Supabase
-- Pegar y ejecutar en: Supabase → SQL Editor → Run
-- ═══════════════════════════════════════════════════

-- ── Tablas ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  emoji       TEXT,
  sort_order  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id),
  name        TEXT NOT NULL,
  short_name  TEXT,
  group_name  TEXT,
  unit        TEXT,
  description TEXT,
  price       DECIMAL(10,2) DEFAULT 0,
  image_url   TEXT,
  available   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id                  SERIAL PRIMARY KEY,
  order_number        TEXT UNIQUE NOT NULL,
  customer_name       TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  customer_address    TEXT,
  customer_references TEXT,
  payment_method      TEXT DEFAULT 'efectivo',
  subtotal            DECIMAL(10,2) DEFAULT 0,
  delivery_fee        DECIMAL(10,2) DEFAULT 0,
  total               DECIMAL(10,2) DEFAULT 0,
  status              TEXT DEFAULT 'pendiente',
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id   INTEGER,
  product_name TEXT NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1,
  unit_price   DECIMAL(10,2) NOT NULL,
  item_total   DECIMAL(10,2) NOT NULL
);

-- ── Row Level Security ───────────────────────────────

ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Lectura pública de categorías y productos
CREATE POLICY "public read categories"  ON categories  FOR SELECT USING (true);
CREATE POLICY "public read products"    ON products    FOR SELECT USING (true);

-- Clientes pueden crear pedidos sin login
CREATE POLICY "public insert orders"      ON orders      FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Admin (autenticado) puede ver y actualizar pedidos
CREATE POLICY "auth read orders"       ON orders      FOR SELECT  TO authenticated USING (true);
CREATE POLICY "auth update orders"     ON orders      FOR UPDATE  TO authenticated USING (true);
CREATE POLICY "auth read order_items"  ON order_items FOR SELECT  TO authenticated USING (true);

-- Admin puede gestionar catálogo
CREATE POLICY "auth manage categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "auth manage products"   ON products   FOR ALL TO authenticated USING (true);

-- ── Datos: Categorías ────────────────────────────────

INSERT INTO categories (id, name, description, emoji, sort_order) VALUES
  (1,  'Pechuga de Pollo',  'Elige cuántas pechugas y en qué presentación',         '🫀', 1),
  (2,  'Pierna y Muslo',    'Arma tu combinado a la medida',                          '🍗', 2),
  (10, 'Alitas de Pollo',   'Alitas solas, frescas y de calidad',                    '🐔', 3),
  (11, 'Retazo de Pollo',   'Con alas o sin alas, precio por kg',                    '🐓', 4),
  (12, 'Especialidades',    'Nuggets · Palomitas · Tenders · Boneless · Papas y más','🔥', 5)
ON CONFLICT (id) DO NOTHING;

-- ── Datos: Productos ─────────────────────────────────

INSERT INTO products (id, category_id, name, short_name, group_name, unit, description, price, image_url, available, sort_order) VALUES
  -- Alitas
  (15, 10, 'Alitas de Pollo', 'Alitas de Pollo', NULL, NULL,
    'Alitas solas, frescas de pollo amarillo. Precio por kg.', 0, '/fotos/alitas.jpg', true, 1),
  -- Retazo
  (32, 11, 'Retazo con Alas', 'Retazo con Alas', NULL, NULL,
    'Retazo de pollo fresco con alas incluidas.', 0, '/fotos/retazo.jpg', true, 1),
  (33, 11, 'Retazo sin Alas', 'Retazo sin Alas', NULL, NULL,
    'Retazo de pollo fresco sin alas.', 0, '/fotos/retazo.jpg', true, 2),
  -- Especialidades: Clásicos
  (35, 12, 'Palomitas de Pollo',   'Palomitas de Pollo', 'Clásicos', '250 g aprox.',    'Pequeños bocados de pollo empanizado.',               70, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=500&q=80', true, 1),
  (42, 12, 'Empanadas',            'Empanadas',          'Clásicos', 'charola (4 pza)', 'Empanadas rellenas de pollo deshebrado.',             95, 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80', true, 2),
  (43, 12, 'Hamburguesa de Pollo', 'Hamburguesa',        'Clásicos', 'charola (4 pza)', 'Filete empanizado con lechuga, tomate y aderezo.',   95, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', true, 3),
  (55, 12, 'Bite''s de Pollo',     'Bite''s',            'Clásicos', '250 g aprox.',    'Bocados de pollo empanizado extra crujientes.',       70, 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80', true, 4),
  (54, 12, 'Dedos de Queso',       'Dedos de Queso',     'Clásicos', '4 pza',           'Dedos de queso fundido empanizados y fritos.',        65, 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80', true, 5),
  (56, 12, 'Dedos de Pescado 🐟',  'Dedos de Pescado 🐟','Clásicos', '4 pza',           'Dedos de pescado empanizados, crujientes y jugosos.', 70, 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80', true, 6),
  -- Especialidades: Nuggets
  (34, 12, 'Nuggets Dinosaurio 🦕','Dinosaurio 🦕',      'Nuggets',  '250 g aprox.',    '100% pechuga en forma de dino, crujientes y jugosos.', 70, 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80', true, 7),
  (53, 12, 'Nuggets Estrella ⭐',  'Estrella ⭐',         'Nuggets',  '250 g aprox.',    '100% pechuga en forma de estrella.',                  70, 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=500&q=80', true, 8),
  -- Especialidades: Tenders
  (36, 12, 'Tenders Natural',      'Natural',            'Tenders',  '500 g aprox.',    'Tiras de pechuga empanizadas, crujientes y jugosas.', 90, 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',  true, 9),
  (38, 12, 'Tenders Spicy 🔥',    'Spicy 🔥',            'Tenders',  '500 g aprox.',    'Tiras de pollo con sabor picante.',                   95, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',  true, 10),
  -- Especialidades: Boneless
  (39, 12, 'Boneless Natural',            'Natural',           'Boneless', '250 g aprox.', 'Pollo sin hueso empanizado, sabor original.', 80, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80', true, 11),
  (40, 12, 'Boneless Pimienta Limón 🍋', 'Pimienta Limón 🍋', 'Boneless', '250 g aprox.', 'Boneless con pimienta y limón.',              80, 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&q=80', true, 12),
  (41, 12, 'Boneless Buffalo',            'Buffalo 🔥',        'Boneless', '250 g aprox.', 'Boneless con salsa buffalo picante.',          85, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',  true, 13),
  -- Especialidades: Papas
  (44, 12, 'Papa Gajo',    'Gajo',    'Papas', '250 g aprox.', 'Gajos de papa sazonados, crujientes por fuera.',  45, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', true, 14),
  (45, 12, 'Papa Recta',   'Recta',   'Papas', '250 g aprox.', 'Papas fritas clásicas bien doradas.',             40, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', true, 15),
  (52, 12, 'Papa Ondulada','Ondulada','Papas', '250 g aprox.', 'Papas onduladas fritas, crujientes y sazonadas.', 45, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', true, 16)
ON CONFLICT (id) DO NOTHING;
