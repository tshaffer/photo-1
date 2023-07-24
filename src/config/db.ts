import mongoose from 'mongoose';

export let legacyConnection: mongoose.Connection;
export let connection: mongoose.Connection;

import { tsPhotoUtilsConfiguration } from './config';

async function connectDB() {
  console.log('uri is:');
  console.log(tsPhotoUtilsConfiguration.MONGO_URI);
  connection = await mongoose.createConnection(tsPhotoUtilsConfiguration.MONGO_URI); 
  console.log(`MongoDB new db connected`);

  mongoose.Promise = global.Promise;
};

export default connectDB;
