/**
 * Script de configuración inicial del administrador.
 * Ejecutar una sola vez: node src/scripts/setupAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const bcrypt   = require('bcryptjs');
const pool     = require('../config/database');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

async function main() {
  console.log('\n🍗 Configuración del Administrador - Pollería Online\n');

  const username  = await ask('Usuario admin (default: admin): ') || 'admin';
  const password  = await ask('Contraseña (default: polleria2024): ') || 'polleria2024';
  const full_name = await ask('Nombre completo (default: Administrador): ') || 'Administrador';

  console.log('\nGenerando hash seguro...');
  const password_hash = await bcrypt.hash(password, 12);

  try {
    await pool.query(
      `INSERT INTO admin_users (username, password_hash, full_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             full_name     = EXCLUDED.full_name,
             active        = true`,
      [username, password_hash, full_name]
    );

    console.log(`\n✅ Administrador creado exitosamente!`);
    console.log(`   Usuario:    ${username}`);
    console.log(`   Contraseña: ${password}`);
    console.log(`   Nombre:     ${full_name}`);
    console.log('\n⚠️  Guarda estas credenciales en un lugar seguro.\n');
  } catch (err) {
    console.error('\n❌ Error al crear el administrador:', err.message);
    console.error('   Asegúrate de haber ejecutado schema.sql primero.\n');
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
  }
}

main();
