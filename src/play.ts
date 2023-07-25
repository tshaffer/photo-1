// import { OpenAI } from "langchain/llms/openai";
// import { PromptTemplate } from "langchain/prompts";
// import { StructuredOutputParser } from "langchain/output_parsers";

// // With a `StructuredOutputParser` we can define a schema for the output.
// const parser = StructuredOutputParser.fromNamesAndDescriptions({
//   answer: "answer to the user's question",
//   source: "source used to answer the user's question, should be a website.",
// });

// const formatInstructions = parser.getFormatInstructions();

// const prompt = new PromptTemplate({
//   template:
//     "Answer the users question as best as possible.\n{format_instructions}\n{question}",
//   inputVariables: ["question"],
//   partialVariables: { format_instructions: formatInstructions },
// });

// const model = new OpenAI({ temperature: 0 });

// const input = await prompt.format({
//   question: "What is the capital of France?",
// });
// const response = await model.call(input);

// console.log(input);
// /*
// Answer the users question as best as possible.
// You must format your output as a JSON value that adheres to a given "JSON Schema" instance.

// "JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

// For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
// would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
// Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

// Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema exactly and there are no trailing commas!

// Here is the JSON Schema instance your output must adhere to. Include the enclosing markdown codeblock:
// ```json
// {"type":"object","properties":{"answer":{"type":"string","description":"answer to the user's question"},"source":{"type":"string","description":"source used to answer the user's question, should be a website."}},"required":["answer","source"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}
// ```

// What is the capital of France?
// */

// console.log(response);
// /*
// {"answer": "Paris", "source": "https://en.wikipedia.org/wiki/Paris"}
// */

// console.log(await parser.parse(response));
// // { answer: 'Paris', source: 'https://en.wikipedia.org/wiki/Paris' }





import { OpenAI } from "langchain/llms/openai";
import * as dotenv from "dotenv";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

// With a `StructuredOutputParser` we can define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "answer to the user's question",
  source: "source used to answer the user's question, should be a website.",
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
