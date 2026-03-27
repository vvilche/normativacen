const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://victorvilche:conecta2171@cluster0.jdsunrp.mongodb.net/?appName=Cluster0';

const UserSchema = new mongoose.Schema({
  email: String,
  isVerified: Boolean,
  otp: {
    code: String,
    expiresAt: Date
  }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkAndVerify() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check victor@conecta.cl
    const user = await User.findOne({ email: 'victor@conecta.cl' });
    if (user) {
      console.log(`User: ${user.email}, Verified: ${user.isVerified}`);
      if (!user.isVerified) {
        user.isVerified = true;
        user.otp = undefined;
        await user.save();
        console.log('User manually VERIFIED for full flow testing.');
      }
    } else {
      console.log('User victor@conecta.cl not found.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkAndVerify();
