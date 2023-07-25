import * as dotenv from "dotenv";
import connectDB from './config/db';
import { DbData, MediaItem } from "entities";
import { getDbData } from "./controllers";
import { exit } from "process";
import { OpenAI } from "langchain/llms/openai";

import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from "langchain/prompts";

dotenv.config();

async function main() {

    console.log('main invoked');

    // await connectDB();

    // const dbData: DbData = await getDbData();

    const input = `
  The user will provide input. The input will include the following: a command to display photos; a specification of which photos to display;
  under what conditions the photos should be displayed.

  If an item in the specification is not in the photos tag list, then immediately respond with only the following:
  Error - item not in tag list: the item that is not in the specification.

  The conditions under which conditions the photos should be displayed can only include a date specification, a date range specification, tags 
  in the tag list, or a combination of these items.
  If the conditions under which conditions the photos should be displayed do not meet this criteria, then immediately respond with the following:
  Error - conditions not specified correctly.

  Otherwise, parse the input and respond with the following format:
  List: the specification of which photos to display. The specification must be a logical expression as described in the examples below for List.
  Conditions: the specification of the conditions under which the photos should be selected. This specification must be a logical expression that should
  include tags, date ranges, and any appropriate logic operators.

  Example input: Display photos of either Sam or Joel from the years 1990 - 1992
  For this input, the output should be as follows:
      \{ List:ist: (Sam || Joel), Conditions: Date::years(1990 - 1992) \}
      
  Example input: Display photos of both Sam and Joel from the years 1990 - 1992
  For this input, the output should be as follows:
      \{ List:ist: (Sam && Joel), Conditions: Date::years(1990 - 1992) \}
      
  Example input: Display photos of both Sam and Joel but not Rachel from the years 1990 - 1992
  For this input, the output should be as follows:
      \{ List:ist: ((Sam && Joel) && !Rachel), Conditions: Date::years(1990 - 1992) \}
      
  Example input: Display photos of both Sam or Joel but not Rachel from the years 1990 - 1992
  For this input, the output should be as follows:
      \{ List:ist: ((Sam || Joel) && !Rachel), Conditions: Date::years(1990 - 1992) \}
  
  If there is a specification of which photos to display, then each item in the specification must be in the photos tag list.
  The photos tag list includes the following items: 
      Sam
      Joel
      Rachel
      Moose
      Bear
      Vacations

  {command}
`;

// Display photos of either Sam or Joel from the years 1990 - 1992
// Display photos of Sam and Joel from 1991 - 1993.

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        List: 'the list as described above',
        Conditions: 'the conditions as described above'
    });
    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template: input,
        inputVariables: ['command'],
        partialVariables: { formatInstructions },
    });


    const model = new OpenAI({ temperature: 0 });

    const modelInput = await prompt.format({
        command: 'Display photos of either Sam or Joel from the years 1990 - 1992'
    })

    const res = await model.call(modelInput);
    console.log({ res });

    const parsedResponse = await parser.parse(res);
    console.log(parsedResponse);

    console.log('exit');

    exit();
}

main();
