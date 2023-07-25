import * as dotenv from "dotenv";
import connectDB from './config/db';
import { DbData, MediaItem } from "entities";
import { getDbData } from "./controllers";
import { exit } from "process";
import { OpenAI } from "langchain/llms/openai";

dotenv.config();

async function main() {

    console.log('main invoked');

    // await connectDB();

    // const dbData: DbData = await getDbData();

    const model = new OpenAI({ temperature: 0 });

    const input = `
  The user will provide input. The input will include the following: a command to display photos; a specification of which photos to display;
  under what conditions the photos should be displayed.

  If an item in the specification is not in the photos tag list, then immediately respond with only the following:
  Error - item not in tag list: the item that is not in the specification.

  The conditions under which conditions the photos should be displayed can only include a date specification, a date range specification, tags 
  in the tag list, or a combination of these items.
  If the conditions under which conditions the photos should be displayed do not meet this criteria, then immedialy respond with the following:
  Error - conditions not specified correctly.

  Otherwise, parse the input and respond with the following format:
  Command: command here
  List: the specification of which photos to display. The specification must be a logical expression as described in the examples below.
  Conditions: the conditions under which the photos should be selected. The conditions

  Example input: Display photos of either Sam or Joel from the years 1990 - 1992
  For this input, the output should be as follows:
      Command: Display photos
      List: Sam || Joel
      Conditions: Years 1990 - 1992
      
  Example input: Display photos of both Sam and Joel from the years 1990 - 1992
  For this input, the output should be as follows:
      Command: Display photos
      List: Sam && Joel
      Conditions: Years 1990 - 1992
      
  Example input: Display photos of both Sam and Joel but not Rachel from the years 1990 - 1992
  For this input, the output should be as follows:
      Command: Display photos
      List: (Sam && Joel) && !Rachel
      Conditions: Years 1990 - 1992
      
  Example input: Display photos of both Sam or Joel but not Rachel from the years 1990 - 1992
  For this input, the output should be as follows:
      Command: Display photos
      List: (Sam || Joel) && !Rachel
      Conditions: Years 1990 - 1992
  
  If there is a specification of which photos to display, then each item in the specification must be in the photos tag list.
  The photos tag list includes the following items: 
      Sam
      Joel
      Rachel
      Moose
      Bear
      Vacations

  Display photos of Sam and Joel on vacations.
`;

    // Display photos of Sam and Joel from 1991 - 1993.

    const res = await model.call(input);
    console.log({ res });

    console.log('exit');

    exit();
}

main();
