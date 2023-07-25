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
    cityAnswer: "answer to the user's question about the capital",
    continentAnswer: "answer to the user's question about the continent",
});

const formatInstructions = parser.getFormatInstructions();

const template = 'Answer the users question as best as possible.\n{format_instructions}\n{question}';

const prompt = new PromptTemplate({
    template,
    inputVariables: ["question"],
    partialVariables: { format_instructions: formatInstructions },
});

dotenv.config();

async function main() {

    const model = new OpenAI({ temperature: 0 });

    const input = await prompt.format({
        question: "What is the capital of France and what continent is it in?",
    });
    const response = await model.call(input);

    // console.log(input);

    console.log(response);

    console.log(await parser.parse(response));
};

main();

