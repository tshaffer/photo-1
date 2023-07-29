import connectDB from '../config/db';
import { DbData, MediaItem, TagToMediaItemsLUT } from "entities";
import { getDbData } from "../controllers";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { cloneDeep, isNil } from 'lodash';

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
    Ted
    Lori
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
        
    Example input: Display photos that don't include Fred.
    The spec for the photos to display is: FredXXXXNOT

    {format_instructions}\n{command}
`;

const prompt = new PromptTemplate({
  template,
  inputVariables: ["command"],
  partialVariables: { format_instructions: formatInstructions },
});

export async function queryPhotos() {

  await connectDB();

  const dbData: DbData = await getDbData();

  const model = new OpenAI({ temperature: 0 });

  const input = await prompt.format({
    // command: "Display photos from our 2021 and 2023 vacations",                   // worked
    // command: "Display photos from vacations 2021-2023",                             // worked
    // command: "Display photos from vacations from the years 2021 - 2023",        // worked
    // command: "Display photos of Joel and ooni"
    // command: "Display photos that don't include Joel"
    command: "Display photos that don't include Joel"
  });
  const response = await model.call(input);

  console.log('INPUT');
  console.log(input);

  console.log('RESPONSE');
  console.log(response);

  console.log('PARSED RESPONSE');
  const responseAsObject = await parser.parse(response);
  console.log(responseAsObject);

  // Bypass LLM for testing purposes
  // const matchingMediaItems: MediaItem[] = parsePhotosToDisplaySpec(dbData, 'JoelXXXXLoriXXXXOR');
  const matchingMediaItems: MediaItem[] = parsePhotosToDisplaySpec(dbData, responseAsObject.photosToDisplaySpec);

  console.log('matchingMediaItems');
  console.log(matchingMediaItems);
}


const isOperator = (token: string): boolean => {
  switch (token.toLowerCase()) {
    case 'and':
    case 'or':
    case 'not':
      return true;
  }
  return false;
}

const applyOrs = (tags: string[], tagToMediaItemsLUT: TagToMediaItemsLUT): MediaItem[] => {

  const resultingMediaItems: MediaItem[] = [];

  for (const tag of tags) {

    if (tagToMediaItemsLUT.hasOwnProperty(tag.toLowerCase())) {

      // get mediaItems for this tag
      const mediaItemsWithThisTag: MediaItem[] = tagToMediaItemsLUT[tag.toLowerCase()];

      // TEDTODO - is there such a thing as a set in javascript??
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

      // merge with mediaItems from prior tags
      for (const mediaItemWithThisTag of mediaItemsWithThisTag) {
        const result = resultingMediaItems.find(({ googleId }) => googleId === mediaItemWithThisTag.googleId);
        if (isNil(result)) {
          resultingMediaItems.push(mediaItemWithThisTag);
        }
      }
    }
  }

  return resultingMediaItems;
}

const applyAnds = (incomingMediaItems: MediaItem[], tags: string[], tagToMediaItemsLUT: TagToMediaItemsLUT): MediaItem[] => {

  let resultingMediaItems: MediaItem[] = [];

  for (const tag of tags) {

    resultingMediaItems = [];

    if (tagToMediaItemsLUT.hasOwnProperty(tag.toLowerCase())) {

      // get mediaItems for this tag
      const mediaItemsWithThisTag: MediaItem[] = tagToMediaItemsLUT[tag.toLowerCase()];

      // for each mediaItem associated with each tag, perform AND with incomingMediaItems
      for (const mediaItemWithThisTag of mediaItemsWithThisTag) {
        // does mediaItem with this tag exist in incomingMediaItems?
        const result = incomingMediaItems.find(({ googleId }) => googleId === mediaItemWithThisTag.googleId);
        if (!isNil(result)) {
          const result = resultingMediaItems.find(({ googleId }) => googleId === mediaItemWithThisTag.googleId);
          if (isNil(result)) {
            resultingMediaItems.push(mediaItemWithThisTag);
          }
        }
      }

    }

    incomingMediaItems = cloneDeep(resultingMediaItems);

  }

  return resultingMediaItems;
}

const applyNot = (incomingMediaItems: MediaItem[], tag: string, tagToMediaItemsLUT: TagToMediaItemsLUT): MediaItem[] => {

  // if this tag is not referenced, return immediately with all incomingMediaItems
  if (!tagToMediaItemsLUT.hasOwnProperty(tag.toLowerCase())) {
    return incomingMediaItems;
  }

  const resultingMediaItems: MediaItem[] = [];

  // get mediaItems for this tag
  const mediaItemsWithThisTag: MediaItem[] = tagToMediaItemsLUT[tag.toLowerCase()];

  for (const mediaItem of incomingMediaItems) {

    const result = mediaItemsWithThisTag.find(({ googleId }) => googleId === mediaItem.googleId);
    if (isNil(result)) {
      resultingMediaItems.push(mediaItem);
    }

  }
  return resultingMediaItems;
}

const applyLogicalOperation = (dbData: DbData, mediaItems: MediaItem[], tags: string[], operator: string): MediaItem[] => {

  switch (operator.toLowerCase()) {
    case 'and':
      return applyAnds(mediaItems, tags, dbData.tagToMediaItemsLUT);
    case 'or':
      return applyOrs(tags, dbData.tagToMediaItemsLUT);
    case 'not':
      return applyNot(mediaItems, tags[0], dbData.tagToMediaItemsLUT);
  }

  return [];
}

function parsePhotosToDisplaySpec(dbData: DbData, photosToDisplaySpecStr: string): MediaItem[] {

  const { mediaItems, tagToMediaItemsLUT } = dbData;
  const tokens: string[] = photosToDisplaySpecStr.split('XXXX');

  const tags: string[] = [];
  let activeListOfMediaItems: MediaItem[] = cloneDeep(mediaItems);

  for (const token of tokens) {
    if (isOperator(token)) {
      // apply logical operation on tags on stack, starting with activeListOfMediaItems => updated list of mediaItems
      activeListOfMediaItems = applyLogicalOperation(dbData, activeListOfMediaItems, tags, token);
    } else {
      // token is a tag
      if (!tagToMediaItemsLUT.hasOwnProperty(token.toLowerCase())) {
        throw ('NotATag');
      }
      // const mediaItemsForTag: MediaItem[] = tagToMediaItemsLUT[token.toLowerCase()];
      // stack.push(mediaItemsForTag);
      tags.push(token);
    }
  }

  return activeListOfMediaItems;
}

