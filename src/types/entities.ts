export interface MediaItem {
  googleId: string;
  fileName: string;
  filePath: string;
  baseUrl: string;
  productUrl: string;
  mimeType: string;
  creationTime: Date;
  width: number;
  height: number;
  orientation?: number;
  description: string;
  gpsPosition?: string;
}

// key is Tag (string)
export interface TagToMediaItemsLUT {
  [key: string]: MediaItem[];
}

export interface DbData {
  mediaItems: MediaItem[];
  tagToMediaItemsLUT: TagToMediaItemsLUT;
}
