import { ContentFields, ContentType, KeyValueMap } from 'contentful-management';
import { Dispatch, SetStateAction } from 'react';
import { ContentfulEnvironmentWithContentTypes } from '../../../api';
import {
  getContentTypeIndex,
  getContentTypeInfoInMaster,
  isContentTypeInMigrationArray,
} from '../utils';

/**
 *
 * @param contentTypeIndex
 * @param field
 * @param contentTypeList
 * @returns
 */
export const getFieldIndex = (
  contentTypeIndex: number,
  field: ContentFields<KeyValueMap>,
  contentTypeList: ContentType[]
) =>
  contentTypeList[contentTypeIndex].fields.findIndex(
    (fieldItem) => fieldItem.id === field.id
  );

/**
 *
 * @param field
 * @param contentType
 * @param migrationItems
 * @returns
 */
export const isFieldSelected = (
  field: ContentFields<KeyValueMap>,
  contentType: ContentType,
  migrationItems: ContentType[]
) => {
  if (!isContentTypeInMigrationArray(contentType, migrationItems)) {
    return false;
  }

  const contentTypeIndex = getContentTypeIndex(contentType, migrationItems);

  return getFieldIndex(contentTypeIndex, field, migrationItems) >= 0;
};

/**
 *
 * @param field
 * @param contentType
 * @returns
 */
export const isDisplayField = (
  field: ContentFields<KeyValueMap>,
  contentType: ContentType
) => field.id === contentType.displayField;

/**
 *
 * @param mainBranch
 * @param contentType
 * @param field
 * @returns
 */
export const isFieldExisting = (
  mainBranch: ContentfulEnvironmentWithContentTypes,
  contentType: ContentType,
  field: ContentFields<KeyValueMap>
) => {
  const info = getContentTypeInfoInMaster(mainBranch, contentType);
  const { contentTypesInMaster, contentTypeIndex } = info;

  if (contentTypeIndex < 0) {
    return false;
  }

  return (
    contentTypesInMaster &&
    contentTypesInMaster[contentTypeIndex].fields.some(
      (fieldItem) => fieldItem.id === field.id
    )
  );
};

/**
 *
 * @param mainBranch
 * @param contentType
 * @param field
 * @returns
 */
export const isFieldInSync = (
  mainBranch: ContentfulEnvironmentWithContentTypes,
  contentType: ContentType,
  field: ContentFields<KeyValueMap>
) => {
  const info = getContentTypeInfoInMaster(mainBranch, contentType);
  const { contentTypesInMaster, contentTypeIndex } = info;

  if (contentTypeIndex < 0) {
    return false;
  }

  const fieldIndex = getFieldIndex(
    contentTypeIndex,
    field,
    contentTypesInMaster ?? []
  );

  return (
    contentTypesInMaster &&
    JSON.stringify(
      contentTypesInMaster[contentTypeIndex].fields[fieldIndex]
    ) === JSON.stringify(field)
  );
};

/**
 *
 * @param field
 * @param contentType
 * @param migrationItems
 * @param setMigrationItems
 * @param removeConentTypeFromMigrationItems
 * @returns
 */
export const handleOnFieldSelected = (
  field: ContentFields<KeyValueMap>,
  contentType: ContentType,
  migrationItems: ContentType[],
  setMigrationItems: Dispatch<SetStateAction<ContentType[]>>,
  // eslint-disable-next-line no-unused-vars
  removeConentTypeFromMigrationItems: (contentTypeIndex: number) => void
) => {
  const contentTypeIndex = getContentTypeIndex(contentType, migrationItems);

  if (contentTypeIndex >= 0) {
    const fieldIndex = getFieldIndex(contentTypeIndex, field, migrationItems);

    const contentTypes = [...migrationItems];
    const contentTypeByIndex = contentTypes[contentTypeIndex];
    const contentTypeFields = [...contentTypeByIndex.fields];

    // if field exitsts in migrationItems, remove it
    if (fieldIndex >= 0) {
      if (contentTypeFields.length === 1) {
        removeConentTypeFromMigrationItems(contentTypeIndex);
        return;
      }

      contentTypeFields.splice(fieldIndex, 1);
      contentTypes[contentTypeIndex] = {
        ...contentTypeByIndex,
        fields: contentTypeFields,
      };
      setMigrationItems(contentTypes);
      return;
      // if field doesn't exist in migrationItems, add it
    }

    contentTypeFields.push(field);
    contentTypes[contentTypeIndex] = {
      ...contentTypeByIndex,
      fields: contentTypeFields,
    };
    setMigrationItems(contentTypes);
    // if contentType doesnt exist in the array, add it with selected field
  } else {
    setMigrationItems([
      ...migrationItems,
      {
        ...contentType,
        fields: contentType.fields.filter(
          (fieldItem) => fieldItem.id === field.id
        ),
      },
    ]);
  }
};
