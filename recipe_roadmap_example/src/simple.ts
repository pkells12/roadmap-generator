// A simple TypeScript file to test the setup and MongoDB connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Basic TypeScript feature test
const add = (a: number, b: number): number => a + b;
console.log(`2 + 3 = ${add(2, 3)}`);

// MongoDB connection string from .env file
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pantry-to-plate';

// Connect to MongoDB
console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    
    // Check connection state 
    const connectionState = mongoose.connection.readyState;
    console.log(`MongoDB connection state: ${connectionState} (1 = connected)`);
    
    // Create a simple schema and model for testing
    const TestSchema = new mongoose.Schema({
      name: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    });
    
    const Test = mongoose.model('Test', TestSchema);
    
    // Create a test document
    return Test.create({ name: 'Test Document' })
      .then(doc => {
        console.log('✅ Successfully created test document:');
        console.log(doc);
        return mongoose.connection.close();
      })
      .then(() => {
        console.log('✅ MongoDB connection closed successfully');
      });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  })
  .finally(() => {
    // Display environment info
    console.log(`\nEnvironment Information:`);
    console.log(`- Node.js version: ${process.version}`);
    console.log(`- Current directory: ${process.cwd()}`);
    console.log(`- MongoDB URI: ${MONGODB_URI}`);
  }); 