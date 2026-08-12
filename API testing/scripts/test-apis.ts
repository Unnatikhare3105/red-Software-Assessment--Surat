import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5000/api';
const OUTPUT_DIR = path.join(__dirname, 'api-test-results');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

let accessToken = '';
let refreshToken = '';
let categoryUuid = '';
let productUuid = '';

async function callAndSave(
  order: number,
  testName: string,
  method: string,
  url: string,
  body?: Record<string, unknown>
) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const requestData = { method, url: `${BASE_URL}${url}`, headers, body: body ?? null };
  let responseData: Record<string, unknown> = {};
  let parsedBody: any = null;

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => { responseHeaders[key] = value; });

    try { parsedBody = await res.json(); } catch { parsedBody = null; }

    responseData = { status: res.status, statusText: res.statusText, headers: responseHeaders, body: parsedBody };
  } catch (err: any) {
    responseData = { error: err.message };
  }

  const filename = `${String(order).padStart(2, '0')}-${testName}.json`;
  fs.writeFileSync(
    path.join(OUTPUT_DIR, filename),
    JSON.stringify({ request: requestData, response: responseData }, null, 2)
  );

  // console.log(`[${order}] ${testName} -> ${responseData.status ?? 'ERROR'} (saved: ${filename})`);
  return parsedBody;
}

async function run() {
  const testEmail = `test_${Date.now()}@example.com`;

  const reg = await callAndSave(1, 'register', 'POST', '/auth/register', {
    name: 'Test User', email: testEmail, password: 'password123',
  });
  accessToken = reg?.data?.accessToken ?? '';
  refreshToken = reg?.data?.refreshToken ?? '';

  const login = await callAndSave(2, 'login', 'POST', '/auth/login', {
    email: testEmail, password: 'password123',
  });
  accessToken = login?.data?.accessToken ?? accessToken;
  refreshToken = login?.data?.refreshToken ?? refreshToken;

  const cat = await callAndSave(3, 'create-category', 'POST', '/categories', { name: 'Test Category' });
  categoryUuid = cat?.data?.uuid;

  await callAndSave(4, 'list-categories', 'GET', '/categories');
  await callAndSave(5, 'get-category', 'GET', `/categories/${categoryUuid}`);
  await callAndSave(6, 'update-category', 'PATCH', `/categories/${categoryUuid}`, { name: 'Updated Category' });

  const prod = await callAndSave(7, 'create-product', 'POST', '/products', {
    name: 'Test Product',
    sku: `SKU-${Date.now()}`,
    categoryId: categoryUuid,
    description: 'A test product',
    quantity: 50,
    unitPrice: 100,
    supplierName: 'Test Supplier',
    lowStockThreshold: 10,
  });
  productUuid = prod?.data?.uuid;

  await callAndSave(8, 'list-products', 'GET', '/products?page=1&limit=10');
  await callAndSave(9, 'get-product', 'GET', `/products/${productUuid}`);
  await callAndSave(10, 'update-product', 'PATCH', `/products/${productUuid}`, { unitPrice: 150 });
  await callAndSave(11, 'increase-stock', 'PATCH', `/products/${productUuid}/stock/increase`, { amount: 20 });
  await callAndSave(12, 'reduce-stock', 'PATCH', `/products/${productUuid}/stock/reduce`, { amount: 5 });
  await callAndSave(13, 'dashboard-stats', 'GET', '/dashboard/stats');

  const refresh = await callAndSave(14, 'refresh-token', 'POST', '/auth/refresh-token', { refreshToken });
  accessToken = refresh?.data?.accessToken ?? accessToken;

  await callAndSave(15, 'delete-product', 'DELETE', `/products/${productUuid}`);
  await callAndSave(16, 'delete-category', 'DELETE', `/categories/${categoryUuid}`);
  await callAndSave(17, 'logout', 'POST', '/auth/logout');

  // console.log(`\n✅ All tests done. Results saved in: ${OUTPUT_DIR}`);
}

run();