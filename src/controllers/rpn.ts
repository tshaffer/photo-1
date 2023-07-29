import { DbData, MediaItem, TagToMediaItemsLUT } from "entities";
import { cloneDeep, isNil } from 'lodash';

export const rpn = (spec: string, dbData: DbData): MediaItem[] => {

  const { mediaItems, tagToMediaItemsLUT } = dbData;
  const tokens: string[] = spec.split('XXXX');

  let tags: string[] = [];
  let activeListOfMediaItems: MediaItem[] = cloneDeep(mediaItems);

  for (const token of tokens) {
    if (isOperator(token)) {
      // apply logical operation on tags on stack, starting with activeListOfMediaItems => updated list of mediaItems
      activeListOfMediaItems = applyLogicalOperation(dbData, activeListOfMediaItems, tags, token);
      tags = [];
    } else {
      // token is a tag
      if (!tagToMediaItemsLUT.hasOwnProperty(token.toLowerCase())) {
        throw ('NotATag');
      }
      tags.push(token);
    }
  }

  return activeListOfMediaItems;
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

