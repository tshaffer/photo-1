import * as dotenv from "dotenv";
import connectDB from './config/db';
import { DbData, MediaItem } from "entities";
import { getDbData } from "./controllers";
import { exit } from "process";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";


// With a `StructuredOutputParser` we can define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
    photosToDisplaySpec: "spec for the photos to display",
});

const formatInstructions = parser.getFormatInstructions();

const template = `
    The user will provide input. The input will include the following: a command to display photos; a spec for the photos to display.
    The spec for which photos to display must includes tags (from the list of tags below) and/or a date specification.

    The list of tags includes: 
    Sam
    Joel
    Rachel
    Moose
    Bear
    Vacation

    Example input: Display photos of either Sam or Joel from the years 1990 - 1992
    The spec for the photos to display is: (Sam or Joel) && dates(1990-1992)
        
    Example input: Display photos of either Sam and Joel from the our vacation.
    The spec for the photos to display is: (Sam and Joel) && Vacations
        
    Example input: Display photos from our 1993 vacation.
    The spec for the photos to display is: (Vacation) && dates(1993)
        
    {format_instructions}\n{command}
`;

const prompt = new PromptTemplate({
    template,
    inputVariables: ["command"],
    partialVariables: { format_instructions: formatInstructions },
});

dotenv.config();

async function main() {

    const model = new OpenAI({ temperature: 0 });

    const input = await prompt.format({
        command: "Display photos from our 2021 vacation",
    });
    const response = await model.call(input);

    console.log(input);

    console.log(response);

    console.log(await parser.parse(response));
};

main();

