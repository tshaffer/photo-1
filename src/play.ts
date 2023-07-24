import { OpenAI } from "langchain/llms/openai";

import * as dotenv from "dotenv";
dotenv.config();

export const run = async () => {

    const model = new OpenAI({ temperature: 0 });

    // list of prior prompts

    // Display photos of Sam from the year 1992.

    // Display photos of Sam and Joel from the years 1990 - 1992.
    // '        Command: Display photos\n' +
    // '        List: Sam, Joel\n' +
    // '        Conditions: Years 1990 - 1992'

    // Display photos of either Sam or Joel from the years 1990 - 1992.
    // '            Command: Display\n' +
    // '            List: Sam, Joel\n' +
    // '            Conditions: 1990 - 1992'

    // Display photos of both Sam and Joel but not Rachel from the years 1990 - 1992.
    // '        Command: Display photos\n' +
    // '        List: Sam, Joel, Rachel\n' +
    // '        Conditions: Years 1990 - 1992, exclude Rachel'

    // Show photos of our European vacations.
    // '        Command: Show\n' +
    // '        List: European vacations\n' +
    // '        Conditions: None'

    // Display photos of bears and moose from our Glacier vacation.

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
    
    const res = await model.call(input);
    console.log({ res });
};
