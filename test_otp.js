const { MongoClient } = require('mongodb');
const MONGODB_URI = "mongodb+srv://victorvilche:conecta2171@cluster0.jdsunrp.mongodb.net/?appName=Cluster0";

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('test'); // Next.js typically uses 'test' or whatever in URI, but I'll check 'users'
    const users = db.collection('users');
    const user = await users.findOne({ email: 'final_test@conecta.cl' });
    if (user && user.otp) {
      console.log('OTP_FOUND:', user.otp.code);
    } else {
      console.log('USER_NOT_FOUND_OR_NO_OTP');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
