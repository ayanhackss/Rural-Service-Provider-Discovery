require('dotenv').config();
const mongoose = require('mongoose');

const URI = process.env.MONGO_URI || 'mongodb+srv://ayanhackss_db_user:Tt9pgVk7uvGv7qml@cluster0.xsneviu.mongodb.net/rural_service_provider';

// Create a generic test model
const TestModel = mongoose.model('TestModel', new mongoose.Schema({
  name: String,
  status: String
}));

async function testCRUD() {
  try {
    await mongoose.connect(URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. CREATE
    console.log('Testing CREATE...');
    const doc = await TestModel.create({ name: 'CRUD_Test', status: 'Pending' });
    console.log('✅ CREATE successful: ', doc._id);

    // 2. READ
    console.log('Testing READ...');
    const readDoc = await TestModel.findById(doc._id);
    if (readDoc && readDoc.name === 'CRUD_Test') {
      console.log('✅ READ successful');
    } else {
      throw new Error('Read failed');
    }

    // 3. UPDATE
    console.log('Testing UPDATE...');
    const updatedDoc = await TestModel.findByIdAndUpdate(
      doc._id,
      { status: 'Completed' },
      { new: true }
    );
    if (updatedDoc && updatedDoc.status === 'Completed') {
      console.log('✅ UPDATE successful');
    } else {
      throw new Error('Update failed');
    }

    // 4. DELETE
    console.log('Testing DELETE...');
    await TestModel.findByIdAndDelete(doc._id);
    const checkDoc = await TestModel.findById(doc._id);
    if (!checkDoc) {
      console.log('✅ DELETE successful');
    } else {
      throw new Error('Delete failed');
    }

    console.log('\n🎉 ALL CRUD OPERATIONS WORKING PROPERLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ CRUD Test Failed:', err);
    process.exit(1);
  }
}

testCRUD();
