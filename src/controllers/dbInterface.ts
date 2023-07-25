import { MediaItem } from '../types';
import {
  getMediaitemModel,
} from '../models';

export const getAllMediaItems = async (): Promise<MediaItem[]> => {

  console.log('getAllMediaItems invoked');

  const mediaItemModel = getMediaitemModel();

  const records: MediaItem[] = [];
  // const documents: any = await (mediaItemModel as any).find().limit(10).exec();
  // const documents: any = await (mediaItemModel as any).find().limit(10).exec();
  // const documents: any = await (mediaItemModel as any).find( { filePath: '/Users/tedshaffer/Documents/ShafferotoBackup/newMediaItems/l/A/AEEKk932ksqu6T0MC342TOLQpoXku3LGlktjmc6aCciqnYcJLNqGeLBvu7cJ9H3as6HL9UYVbaVc8jRFM1liknJwV-bjMU89lA.JPG' }).exec();
  // const documents: any = await (mediaItemModel as any).find( { description: '' }).exec();
  const documents: any = await (mediaItemModel as any).find( { description: { $ne: ''} }).exec();
  for (const document of documents) {
    const mediaItem: MediaItem = document.toObject() as MediaItem;
    mediaItem.googleId = document.googleId.toString();
    const description = document.description.toString();
    if (!description.includes('best canyon around')) {
      if (description.startsWith('TedTag-')) {
        records.push(mediaItem);
      }
    }
  }
  console.log('records');
  console.log(records);
  return records;
}

