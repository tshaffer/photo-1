import path from "path";
import connectDB from './config/db';

//process.argv returns an array containing command line arguments
// exampleName is the file path of the example we want to `run`
const [exampleName, ...args] = process.argv.slice(2);

console.log(exampleName, ...args);

let runExample;

await connectDB();

try {
  ({ run: runExample } = require(path.join(__dirname, exampleName)));
} catch {
  throw new Error(`Could not load example ${exampleName}`);
}

runExample();
