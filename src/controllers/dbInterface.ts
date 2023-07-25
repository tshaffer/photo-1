import { DbData, MediaItem, TagToMediaItemsLUT } from '../types';
import {
  getMediaitemModel,
} from '../models';

export const getDbData = async (): Promise<DbData> => {

  console.log('getAllMediaItems invoked');

  const mediaItems: MediaItem[] = [];
  const tagToMediaItemsLUT: TagToMediaItemsLUT = {};

  const dbData: DbData = {
    mediaItems,
    tagToMediaItemsLUT,
  };

  const mediaItemModel = getMediaitemModel();

  const documents: any = await (mediaItemModel as any).find({ description: { $ne: '' } }).exec();
  for (const document of documents) {

    const mediaItem: MediaItem = document.toObject() as MediaItem;
    mediaItem.googleId = document.googleId.toString();
    mediaItems.push(mediaItem);

    const description: string = document.description.toString();
    if (!description.includes('best canyon around')) {
      if (description.startsWith('TedTag-')) {
        // mediaItem includes one or more tags
        const tagsSpec: string = description.substring('TedTag-'.length);
        const tags: string[] = tagsSpec.split(':');
        if (tags.length > 0) {
          tags.forEach((tag: string) => {
            if (!tagToMediaItemsLUT.hasOwnProperty(tag)) {
              tagToMediaItemsLUT[tag] = [];
            }
            tagToMediaItemsLUT[tag].push(mediaItem);
          })
        }
      }
    }
  }

  console.log('dbData');
  console.log(dbData);

  return dbData;
}

