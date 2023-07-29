import * as dotenv from "dotenv";
import { queryPhotos } from "./tasks/queryPhotos";

async function main() {

  dotenv.config();

  queryPhotos();
  console.log('exit');

};

main();


