import { OpenAI } from "langchain/llms/openai";

import * as dotenv from "dotenv";
dotenv.config();

export const run = async () => {

    const model = new OpenAI({ temperature: 0 });

    // list of prior prompts

    // Display photos of Sam from the year 1992.

    // Display photos of Sam and Joel from the years 1990 - 1992.
    // res: '\n' +
    // '        Command: Display photos\n' +
    // '        List: Sam, Joel\n' +
    // '        Conditions: Years 1990 - 1992'

    // Display photos of both Sam and Joel but not Rachel from the years 1990 - 1992.
    // res: '\n' +
    // '        Command: Display photos\n' +
    // '        List: Sam, Joel, Rachel\n' +
    // '        Conditions: Years 1990 - 1992, exclude Rachel'

    const input = `
        The user will provide input. The input will include the following: a command to display photos; which photos to display;
        under what conditions the photos should be displayed.

        Parse the input and respond with the following format:
            Command: command here
            List: the list of people whose photos should be displayed
            Conditions: the conditions under which the photos should be selected.
          
        Show photos of both Sam and Joel but not Rachel from the years 1990 - 1992.
              `;
    const res = await model.call(input);
    console.log({ res });
};
