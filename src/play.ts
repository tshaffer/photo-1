//Import the OpenAPI Large Language Model (you can import other models here eg. Cohere)
import { OpenAI } from "langchain/llms";

//Load environment variables (populate process.env from .env file)
import * as dotenv from "dotenv";
dotenv.config();

export const run = async () => {

    //Instantiante the OpenAI model 
    //Pass the "temperature" parameter which controls the RANDOMNESS of the model's output. A lower temperature will result in more predictable output, while a higher temperature will result in more random output. The temperature parameter is set between 0 and 1, with 0 being the most predictable and 1 being the most random
    const model = new OpenAI({ temperature: 0 });

    // const input = `
    //   Given an input question, answer the question and return the answer using the following format:
    //   Question: Question here
    //   Answer: Answer here

    //   What is the capital of France?
    //       `;

    const input = `
        The user will provide input. The input will include the following: a command to display photos; list of people whose photos should be displayed;
        under what conditions the photos should be selected.

        Parse the input and respond with the following format:
            Command: command here
            List: the list of people whose photos should be displayed
            Conditions: the conditions under which the photos should be selected.
          
        Display photos of Sam from the year 1992.
              `;
    const res = await model.call(input);
    console.log({ res });
};
