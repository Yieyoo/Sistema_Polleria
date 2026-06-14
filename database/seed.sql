-- ============================================================
-- DATOS INICIALES - POLLERÍA ONLINE
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

-- ============================================================
-- CATEGORÍAS
-- ============================================================
INSERT INTO categories (name, description, emoji, sort_order) VALUES
  ('Pollos Enteros',      'Pollos a la brasa enteros, dorados y jugosos',       '🍗', 1),
  ('Medios y Cuartos',    'Porciones perfectas para compartir',                 '🍖', 2),
  ('Combos Familiares',   'Las mejores ofertas para toda la familia',           '👨‍👩‍👧‍👦', 3),
  ('Guarniciones',        'Papas, ensaladas y acompañamientos',                '🥗', 4),
  ('Bebidas',             'Refrescantes bebidas para tu pedido',                '🥤', 5),
  ('Extras',              'Salsas, cremas y adicionales',                       '🫙', 6)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRODUCTOS — Pollos Enteros
-- ============================================================
INSERT INTO products (category_id, name, description, price, image_url, sort_order) VALUES
  (1, 'Pollo Entero a la Brasa',
   'Pollo dorado a las brasas con nuestra sazón secreta. Incluye papas fritas y cremas.',
   220.00,
   'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=500&q=80',
   1),
  (1, 'Pollo Entero BBQ',
   'Pollo marinado con salsa BBQ ahumada, perfectamente asado. Incluye ensalada y pan.',
   240.00,
   'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&q=80',
   2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRODUCTOS — Medios y Cuartos
-- ============================================================
INSERT INTO products (category_id, name, description, price, image_url, sort_order) VALUES
  (2, 'Medio Pollo a la Brasa',
   'Medio pollo jugoso acompañado de papas fritas doradas y ensalada fresca.',
   120.00,
   'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',
   1),
  (2, 'Cuarto de Pollo',
   'Cuarto de pollo tierno con ensalada y pan de ajo recién horneado.',
   75.00,
   'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80',
   2),
  (2, 'Cuarto de Pollo + Papas',
   'Cuarto de pollo dorado acompañado de abundantes papas fritas crujientes.',
   90.00,
   'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=500&q=80',
   3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRODUCTOS — Combos Familiares
-- ============================================================
INSERT INTO products (category_id, name, description, price, image_url, sort_order) VALUES
  (3, 'Combo Familiar Básico',
   '1 pollo entero + papas grandes + ensalada + 2 gaseosas 600ml. ¡Perfecto para 4 personas!',
   290.00,
   'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&q=80',
   1),
  (3, 'Combo Familiar Doble',
   '2 pollos enteros + papas extra grandes + ensalada grande + 4 gaseosas. ¡Para la familia!',
   520.00,
   'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80',
   2),
  (3, 'Combo Pareja',
   'Medio pollo + papas grandes + ensalada + 2 gaseosas 600ml. Ideal para dos.',
   195.00,
   'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?w=500&q=80',
   3),
  (3, 'Combo Amigos x4',
   '4 cuartos de pollo + 2 papas grandes + ensalada grande + 4 gaseosas.',
   340.00,
   'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&q=80',
   4)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRODUCTOS — Guarniciones
-- ============================================================
INSERT INTO products (category_id, name, description, price, image_url, sort_order) VALUES
  (4, 'Papas Fritas Pequeñas',  'Papas crujientes recién fritas, porción individual.',     35.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', 1),
  (4, 'Papas Fritas Grandes',   'Porción extra grande de papas fritas, para compartir.',  55.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', 2),
  (4, 'Ensalada Fresca',        'Lechuga, tomate, pepino y zanahoria con aderezo.',        30.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80', 3),
  (4, 'Yuca Frita',             'Yuca dorada y crujiente, acompañamiento tradicional.',   40.00, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=500&q=80', 4),
  (4, 'Arroz con Leche',        'Postre tradicional de arroz cremoso con canela.',         25.00, 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=500&q=80', 5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRODUCTOS — Bebidas
-- ============================================================
INSERT INTO products (category_id, name, description, price, image_url, sort_order) VALUES
  (5, 'Gaseosa 600ml',   'Coca-Cola, Sprite o Fanta a elegir.',            25.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80', 1),
  (5, 'Gaseosa 1.5L',    'Botella familiar de Coca-Cola, Sprite o Fanta.', 40.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80', 2),
  (5, 'Agua Mineral',    'Agua natural 500ml.',                             15.00, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80', 3),
  (5, 'Chicha Morada 1L','Tradicional chicha morada casera, 1 litro.',     30.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80', 4),
  (5, 'Jugo Natural',    'Jugo de temporada recién exprimido, 500ml.',      28.00, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80', 5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRODUCTOS — Extras
-- ============================================================
INSERT INTO products (category_id, name, description, price, image_url, sort_order) VALUES
  (6, 'Crema de Ají',  'Picante y sabrosa crema de ají, nuestra receta especial.',   10.00, 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=500&q=80', 1),
  (6, 'Mayonesa',      'Mayonesa cremosa extra.',                                     8.00, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80', 2),
  (6, 'Salsa BBQ',     'Salsa BBQ ahumada de la casa.',                              10.00, 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=500&q=80', 3),
  (6, 'Pan de Ajo x4', '4 piezas de pan de ajo recién horneado con mantequilla.',   20.00, 'https://images.unsplash.com/photo-1568600891597-dc9ee7d30084?w=500&q=80', 4),
  (6, 'Porción Extra de Papas', 'Porción adicional de papas fritas.',                25.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', 5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- NOTA SOBRE EL USUARIO ADMIN:
-- Ejecuta el siguiente comando para crear el admin:
--   cd server
--   node src/scripts/setupAdmin.js
-- Esto creará el usuario: admin / polleria2024
-- ============================================================
