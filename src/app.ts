import * as dotenv from "dotenv";
import { queryPhotos } from "./tasks/queryPhotos";
import { exit } from "process";

async function main() {

  dotenv.config();

  await queryPhotos();
  console.log('exit');

  exit();
};

main();


