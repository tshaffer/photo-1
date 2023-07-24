import * as dotenv from "dotenv";
import connectDB from './config/db';
import { MediaItem } from "entities";
import { getAllMediaItems } from "./controllers";
import { exit } from "process";

dotenv.config();

async function main() {

  console.log('main invoked');

  await connectDB();

  const mediaItems: MediaItem[] = await getAllMediaItems();
  console.log(mediaItems);

  console.log('exit');

  exit();
}

main();
