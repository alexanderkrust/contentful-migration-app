import { ContentType } from 'contentful-management';
import { atom } from 'recoil';

const MIGRATION_ITEMS_STATE_KEY = 'migrationItemsState';

export const migrationItemsState = atom<ContentType[]>({
  key: MIGRATION_ITEMS_STATE_KEY,
  default: [] as ContentType[],
});
