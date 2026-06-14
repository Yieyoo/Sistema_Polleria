import axios from 'axios';
import { CATEGORIES, PRODUCTS, mockCreateOrder } from './mockData.js';

// ── Modo demo (sin backend) ────────────────────────────────────
// Cambia a false cuando tengas PostgreSQL + servidor listos
const USE_MOCK = true;

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// ── API real (Axios) ───────────────────────────────────────────
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── API pública ────────────────────────────────────────────────
export const getCategories = async () => {
  if (USE_MOCK) {
    await delay();
    return { data: CATEGORIES };
  }
  return api.get('/products/categories');
};

export const getProducts = async (catId) => {
  if (USE_MOCK) {
    await delay();
    const filtered = catId
      ? PRODUCTS.filter(p => p.category_id === catId && p.available)
      : PRODUCTS.filter(p => p.available);
    return { data: filtered };
  }
  return api.get('/products', catId ? { params: { category_id: catId } } : {});
};

export const createOrder = async (data) => {
  if (USE_MOCK) {
    await delay(900);
    return { data: mockCreateOrder(data) };
  }
  return api.post('/orders', data);
};

// ── API admin ──────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 1, order_number: 'PG-260614-4821', customer_name: 'Juan Pérez', customer_phone: '5512345678',
    customer_address: 'Recoge en tienda', payment_method: 'efectivo',
    subtotal: 160, delivery_fee: 0, total: 160, status: 'preparando', notes: '',
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    items: [{ product_name: 'Boneless Natural', quantity: 2, product_price: 80, item_total: 160 }] },
  { id: 2, order_number: 'PG-260614-3392', customer_name: 'María García', customer_phone: '5598765432',
    customer_address: 'Recoge en tienda', payment_method: 'transferencia',
    subtotal: 290, delivery_fee: 0, total: 290, status: 'pendiente', notes: 'Extra salsa buffalo',
    created_at: new Date(Date.now() - 3 * 60000).toISOString(),
    items: [
      { product_name: 'Boneless Buffalo', quantity: 2, product_price: 85, item_total: 170 },
      { product_name: 'Papa Gajo', quantity: 2, product_price: 45, item_total: 90 },
      { product_name: 'Nuggets de Pollo', quantity: 1, product_price: 70, item_total: 70 },
    ]},
  { id: 3, order_number: 'PG-260614-1105', customer_name: 'Carlos López', customer_phone: '5511223344',
    customer_address: 'Recoge en tienda', payment_method: 'efectivo',
    subtotal: 130, delivery_fee: 0, total: 130, status: 'en_camino', notes: '',
    created_at: new Date(Date.now() - 35 * 60000).toISOString(),
    items: [{ product_name: 'Charola Chica', quantity: 1, product_price: 130, item_total: 130 }] },
  { id: 4, order_number: 'PG-260614-7734', customer_name: 'Ana Martínez', customer_phone: '5544332211',
    customer_address: 'Recoge en tienda', payment_method: 'transferencia',
    subtotal: 390, delivery_fee: 0, total: 390, status: 'entregado', notes: '',
    created_at: new Date(Date.now() - 90 * 60000).toISOString(),
    items: [{ product_name: 'Charola Grande', quantity: 1, product_price: 390, item_total: 390 }] },
];

let mockOrdersState = [...MOCK_ORDERS];

export const adminLogin = async (creds) => {
  if (USE_MOCK) {
    await delay(600);
    if (creds.username === 'admin' && creds.password === 'polleria2024') {
      const token = 'mock-token-demo';
      return { data: { token, username: 'admin', full_name: 'Administrador' } };
    }
    throw { response: { data: { error: 'Credenciales incorrectas.' } } };
  }
  return api.post('/admin/login', creds);
};

export const getOrders = async (params) => {
  if (USE_MOCK) {
    await delay(400);
    let filtered = [...mockOrdersState];
    if (params?.status) filtered = filtered.filter(o => o.status === params.status);
    return { data: { orders: filtered, total: filtered.length, page: 1, limit: 30 } };
  }
  return api.get('/admin/orders', { params });
};

export const updateStatus = async (id, status) => {
  if (USE_MOCK) {
    await delay(300);
    mockOrdersState = mockOrdersState.map(o => o.id === id ? { ...o, status } : o);
    return { data: mockOrdersState.find(o => o.id === id) };
  }
  return api.patch(`/admin/orders/${id}`, { status });
};

export const getDailySummary = async (date) => {
  if (USE_MOCK) {
    await delay(300);
    return { data: { total_orders: 4, pending: 1, preparing: 1, on_the_way: 1, delivered: 1, cancelled: 0, total_revenue: 970, confirmed_revenue: 390 } };
  }
  return api.get('/admin/summary', date ? { params: { date } } : {});
};

export default api;
