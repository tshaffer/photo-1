import * as dotenv from "dotenv";
import connectDB from './config/db';

dotenv.config();

async function main() {

  console.log('main invoked');

  await connectDB();

  console.log('exit');
}

main();
