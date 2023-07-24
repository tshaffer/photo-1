import * as dotenv from 'dotenv';
import { isNil } from 'lodash';
// import { TsPhotoUtilsConfiguration } from '../types';
export interface TsPhotoUtilsConfiguration {
  MONGO_URI: string;
  MONGO_URI_OLD: string;
  DATA_DIR: string;
  MEDIA_ITEMS_DIR: string;
  TAKEOUT_ITEMS_DIR: string;
  GOOGLE_MEDIA_ITEMS_BY_ID: string;
  OLD_GOOGLE_MEDIA_ITEMS_BY_ID: string;
  ADDED_GOOGLE_MEDIA_ITEMS: string;
  TAKEOUT_FILES_BY_FILE_NAME: string;
  TAKEOUT_FILES_BY_CREATE_DATE: string;
  TAKEOUT_FILES_BY_DATE_TIME_ORIGINAL: string;
  TAKEOUT_FILES_BY_MODIFY_DATE: string;
  TAKEOUT_FILES_BY_IMAGE_DIMENSIONS: string;
  FILE_PATHS_TO_EXIF_TAGS: string;
  METADATA_FILE_PATH_BY_TAKEOUT_FILE_PATH: string;
}


export let tsPhotoUtilsConfiguration: TsPhotoUtilsConfiguration;

export const readConfig = (pathToConfigFile: string): void => {

  try {
    const configOutput: dotenv.DotenvConfigOutput = dotenv.config({ path: pathToConfigFile });
    const pc: dotenv.DotenvParseOutput | undefined = configOutput.parsed;
    const parsedConfig: dotenv.DotenvParseOutput = pc as dotenv.DotenvParseOutput;

    if (!isNil(parsedConfig)) {
      tsPhotoUtilsConfiguration = {
        MONGO_URI: parsedConfig.MONGO_URI,
        MONGO_URI_OLD: parsedConfig.MONGO_URI_OLD_DB,
        DATA_DIR: parsedConfig.DATA_DIR,
        TAKEOUT_ITEMS_DIR: parsedConfig.TAKEOUT_ITEMS_DIR,
        MEDIA_ITEMS_DIR: parsedConfig.MEDIA_ITEMS_DIR,
        GOOGLE_MEDIA_ITEMS_BY_ID: parsedConfig.GOOGLE_MEDIA_ITEMS_BY_ID,
        OLD_GOOGLE_MEDIA_ITEMS_BY_ID: parsedConfig.OLD_GOOGLE_MEDIA_ITEMS_BY_ID,
        ADDED_GOOGLE_MEDIA_ITEMS: parsedConfig.ADDED_GOOGLE_MEDIA_ITEMS,
        TAKEOUT_FILES_BY_FILE_NAME: parsedConfig.TAKEOUT_FILES_BY_FILE_NAME,
        TAKEOUT_FILES_BY_CREATE_DATE: parsedConfig.TAKEOUT_FILES_BY_CREATE_DATE,
        TAKEOUT_FILES_BY_DATE_TIME_ORIGINAL: parsedConfig.TAKEOUT_FILES_BY_DATE_TIME_ORIGINAL,
        TAKEOUT_FILES_BY_MODIFY_DATE: parsedConfig.TAKEOUT_FILES_BY_MODIFY_DATE,
        TAKEOUT_FILES_BY_IMAGE_DIMENSIONS: parsedConfig.TAKEOUT_FILES_BY_IMAGE_DIMENSIONS,
        FILE_PATHS_TO_EXIF_TAGS: parsedConfig.FILE_PATHS_TO_EXIF_TAGS,
        METADATA_FILE_PATH_BY_TAKEOUT_FILE_PATH: parsedConfig.METADATA_FILE_PATH_BY_TAKEOUT_FILE_PATH,
      };
      console.log(tsPhotoUtilsConfiguration);
    }
  }
  catch (err) {
    console.log('Dotenv config error: ' + err.message);
  }
};
