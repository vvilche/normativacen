const { MongoClient } = require('mongodb');
const postmark = require('postmark');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables manualmente para el script
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  const postmarkToken = process.env.POSTMARK_API_TOKEN;
  
  console.log('--- TEST DE CONFIGURACIÓN ---');
  console.log('URI detectada:', uri ? 'SÍ' : 'NO');
  console.log('Postmark detectado:', postmarkToken ? 'SÍ' : 'NO');

  if (uri) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('✅ MongoDB Conectado!');
      await client.close();
    } catch (e) {
      console.log('❌ MongoDB Error:', e.message);
    }
  }

  if (postmarkToken) {
    try {
      const client = new postmark.ServerClient(postmarkToken);
      const server = await client.getServer();
      console.log('✅ Postmark Autenticado! (Nombre:', server.Name, ')');
    } catch (e) {
      console.log('❌ Postmark Error:', e.message);
    }
  }
}

testConnection();
