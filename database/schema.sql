-- ============================================================
-- POLLERÍA ONLINE - ESQUEMA DE BASE DE DATOS
-- PostgreSQL 14+
-- ============================================================

-- ============================================================
-- TABLA: categories (Categorías del menú)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    emoji       VARCHAR(10)  DEFAULT '🍗',
    sort_order  INT          DEFAULT 0,
    active      BOOLEAN      DEFAULT true,
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- TABLA: products (Productos del menú)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    category_id INT          REFERENCES categories(id) ON DELETE SET NULL,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    price       DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    image_url   VARCHAR(500),
    available   BOOLEAN      DEFAULT true,
    sort_order  INT          DEFAULT 0,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- TABLA: orders (Pedidos)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id                   SERIAL PRIMARY KEY,
    order_number         VARCHAR(20) UNIQUE NOT NULL,
    customer_name        VARCHAR(200) NOT NULL,
    customer_phone       VARCHAR(20)  NOT NULL,
    customer_address     TEXT         NOT NULL,
    customer_references  TEXT,
    payment_method       VARCHAR(20)  NOT NULL
                            CHECK (payment_method IN ('efectivo', 'transferencia')),
    subtotal             DECIMAL(10,2) NOT NULL,
    delivery_fee         DECIMAL(10,2) DEFAULT 0.00,
    total                DECIMAL(10,2) NOT NULL,
    status               VARCHAR(20)  NOT NULL DEFAULT 'pendiente'
                            CHECK (status IN ('pendiente','preparando','en_camino','entregado','cancelado')),
    notes                TEXT,
    created_at           TIMESTAMPTZ  DEFAULT NOW(),
    updated_at           TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- TABLA: order_items (Detalle de cada pedido)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id            SERIAL PRIMARY KEY,
    order_id      INT          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id    INT          REFERENCES products(id) ON DELETE SET NULL,
    product_name  VARCHAR(200) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity      INT          NOT NULL CHECK (quantity > 0),
    item_total    DECIMAL(10,2) NOT NULL,
    created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- TABLA: admin_users (Usuarios administradores)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(200),
    active        BOOLEAN     DEFAULT true,
    last_login    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FUNCIÓN + TRIGGERS: mantener updated_at actualizado
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ÍNDICES para consultas frecuentes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at    ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number  ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available   ON products(available);
CREATE INDEX IF NOT EXISTS idx_categories_sort      ON categories(active, sort_order);
