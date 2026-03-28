const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function deleteUser() {
  const uri = process.env.MONGODB_URI;
  const email = 'victor.vilche@gmail.com';
  
  if (!uri) {
    console.error('❌ Error: MONGODB_URI no encontrada en .env.local');
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(); // Usa la DB default del URI
    const result = await db.collection('users').deleteOne({ email: email });
    
    if (result.deletedCount > 0) {
      console.log(`✅ Usuario [${email}] eliminado con éxito.`);
    } else {
      console.log(`⚠️  No se encontró al usuario [${email}] en la base de datos.`);
    }
  } catch (e) {
    console.error('❌ Error eliminando usuario:', e.message);
  } finally {
    await client.close();
  }
}

deleteUser();
