import { OpenAI } from "langchain/llms/openai";
import * as dotenv from "dotenv";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

// With a `StructuredOutputParser` we can define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: "answer to the user's question",
});

const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
    template:
        "Answer the users question as best as possible.\n{format_instructions}\n{question}",
    inputVariables: ["question"],
    partialVariables: { format_instructions: formatInstructions },
});




dotenv.config();

export const run = async () => {

    const model = new OpenAI({ temperature: 0 });

    const input = await prompt.format({
        question: "What is the capital of France?",
    });
    const response = await model.call(input);

    // console.log(input);

    console.log(response);

    console.log(await parser.parse(response));
};
