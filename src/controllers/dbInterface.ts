import { MediaItem } from '../types';
import {
  getMediaitemModel,
} from '../models';

export const getAllMediaItems = async (): Promise<MediaItem[]> => {

  const mediaItemModel = getMediaitemModel();

  const records: MediaItem[] = [];
  // const documents: any = await (mediaItemModel as any).find().limit(100).exec();
  const documents: any = await (mediaItemModel as any).find().exec();
  for (const document of documents) {
    const mediaItem: MediaItem = document.toObject() as MediaItem;
    mediaItem.googleId = document.googleId.toString();
    records.push(mediaItem);
  }
  console.log('records');
  console.log(records);
  return records;
}

