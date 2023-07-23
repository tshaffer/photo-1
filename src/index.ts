import path from "path";

//process.argv returns an array containing command line arguments
// exampleName is the file path of the example we want to `run`
const [exampleName, ...args] = process.argv.slice(2);

console.log(exampleName, ...args);

let runExample;

try {
  console.log('dirName: ' + __dirname);
  console.log('exampleName: ' + exampleName);
  console.log(path.join(__dirname, exampleName));
  ({ run: runExample } = require(path.join(__dirname, exampleName)));
} catch {
  throw new Error(`Could not load example ${exampleName}`);
}

runExample();
