import * as dotenv from "dotenv";
import connectDB from './config/db';
import { DbData, MediaItem } from "entities";
import { getDbData } from "./controllers";
import { exit } from "process";
import { OpenAI } from "langchain/llms/openai";

dotenv.config();

async function main() {

    console.log('main invoked');

    await connectDB();

    const dbData: DbData = await getDbData();
    // console.log(mediaItems);

    // const model = new OpenAI({ temperature: 0 });

    const input = `
  The user will provide input. The input will include the following: a command to display photos; a specification of which photos to display;
  under what conditions the photos should be displayed.

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

  If an item in the specification is not in the photos tag list, then immediately respond with the following:
  Error - item not in tag list: the item that is not in the specification.

  Otherwise, parse the input and respond with the following format:
  Command: command here
  List: the specification of which photos to display
  Conditions: the conditions under which the photos should be selected.

  Display photos of bears and moose from our 2023 Glacier vacation.
`;

    //   const res = await model.call(input);
    //   console.log({ res });

    console.log('exit');

    //   exit();
}

main();
