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
    photosToDisplayAnswer: "answer for photos to display",
    photoDatesAnswer: "answer for the photo dates",
});

const formatInstructions = parser.getFormatInstructions();

// const template = 'Answer the users question as best as possible.\n{format_instructions}\n{question}';
const template = `
    The user will provide input. The input will include the following: a command to display photos; which photos to display;
    the dates for the photos.

    Example input: Display photos of either Sam or Joel from the years 1990 - 1992
    The answer for photos to display is: Sam or Joel
    The answer for the photo dates is: 1990 - 1992
    
    Answer the users question as best as possible. 
    
    {format_instructions}\n{question}
`;

const prompt = new PromptTemplate({
    template,
    inputVariables: ["question"],
    partialVariables: { format_instructions: formatInstructions },
});

dotenv.config();

async function main() {

    const model = new OpenAI({ temperature: 0 });

    const input = await prompt.format({
        question: "Display photos of either Sam or Joel from the years 1990 - 1992",
    });
    const response = await model.call(input);

    console.log(input);

    console.log(response);

    console.log(await parser.parse(response));
};

main();

