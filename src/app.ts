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
    The user will provide input. The input will include the following: a command to display photos; a photos selection spec.
    The photos selection spec must include one or more tags (from the list of tags below) and/or a date specification.

    The format for a date specification begins with dateSpec** and ends with **. The dates are between the sets of asterisks. 
    A range of years is specified as: dateSpec**starting year - ending year**
    A list of years is specified as: dateSpec**year1 and year2 and year3**
    A single year is specified as: dateSpec**year**

    The list of tags includes: 
    Sam
    Joel
    Rachel
    Moose
    Bear
    Vacation

    Return a spec for the photos to display, formatted using Reverse Polish Notation (see examples below).
    
    Example input: Display photos of either Sam or Joel from the years 1990 - 1992
    The spec for the photos to display is: SamXXXXJoelXXXXORXXXXdateSpec**1990 through 1992**XXXXAND
        
    Example input: Display photos of either Sam and Joel from the our vacation.
    The spec for the photos to display is: SamXXXXJoelXXXXANDXXXXVacationsXXXXAND
        
    Example input: Display photos from our 1993 vacation.
    The spec for the photos to display is: VacationXXXXdateSpec**1993**XXXXAND
        
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
        // command: "Display photos from our 2021 and 2023 vacations",                   // worked
        command: "Display photos from vacations 2021-2023",                             // worked
        // command: "Display photos from vacations from the years 2021 - 2023",        // worked
    });
    const response = await model.call(input);

    console.log(input);

    console.log(response);

    console.log(await parser.parse(response));
};

main();

