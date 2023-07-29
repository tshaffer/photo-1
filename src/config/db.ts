import mongoose from 'mongoose';

export let legacyConnection: mongoose.Connection;
export let connection: mongoose.Connection;

async function connectDB() {
  console.log('uri is:');
  console.log(process.env.MONGO_URI);
  connection = await mongoose.createConnection(process.env.MONGO_URI as string);
  console.log(`MongoDB new db connected`);

  mongoose.Promise = global.Promise;
};

export default connectDB;
