const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/workshop-logger'; // Change if your DB URI is different

async function dropIndex() {
  await mongoose.connect(uri);
  try {
    const result = await mongoose.connection.db.collection('sessions').dropIndex('qrCode_1');
    console.log('Index dropped:', result);
  } catch (err) {
    console.error('Error dropping index:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

dropIndex(); 