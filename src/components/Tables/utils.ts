/* eslint-disable no-nested-ternary */
import { ContentFields, ContentType, KeyValueMap } from 'contentful-management';
import { ContentfulEnvironmentWithContentTypes } from '../../api';
import { isFieldExisting, isFieldInSync } from './Field/utils';

/**
 * TODO: Write JSDoc
 * @param contentType
 * @returns
 */
export const getContentTypeIndex = (
  contentType: ContentType,
  contentTypeList: ContentType[]
) =>
  contentTypeList.findIndex(
    (contenTypeItem: ContentType) =>
      contenTypeItem.sys.id === contentType.sys.id
  );

/**
 * TODO: Write JSDoc
 * @param contentType
 * @returns
 */
export const getContentTypeInfoInMaster = (
  mainBranch: ContentfulEnvironmentWithContentTypes,
  contentType: ContentType
) => {
  const contentTypesInMaster = mainBranch?.contentTypes;

  const contentTypeIndex = getContentTypeIndex(
    contentType,
    contentTypesInMaster ?? []
  );

  return {
    contentTypesInMaster,
    contentTypeIndex,
  };
};

/**
 *
 * @param mainBranch
 * @param contentType
 * @returns
 */
export const isContentTypeInSync = (
  mainBranch: ContentfulEnvironmentWithContentTypes,
  contentType: ContentType
) => {
  const info = getContentTypeInfoInMaster(mainBranch, contentType);
  const { contentTypesInMaster, contentTypeIndex } = info;

  if (contentTypeIndex < 0) {
    return false;
  }

  if (!contentTypesInMaster) {
    return false;
  }

  if (
    contentType.fields.length !==
    contentTypesInMaster[contentTypeIndex].fields.length
  ) {
    return false;
  }

  const inSync = contentType.fields.every((field) => {
    const fieldInMasterContentType = contentTypesInMaster[
      contentTypeIndex
    ].fields.find((fieldItem) => fieldItem.id === field.id);
    return (
      fieldInMasterContentType &&
      JSON.stringify(field) === JSON.stringify(fieldInMasterContentType)
    );
  });

  return inSync;
};

/**
 * TODO: Write JSDoc
 * @param contentType
 * @returns
 */
export const isContentTypeInMigrationArray = (
  contentType: ContentType,
  migrationArray: ContentType[]
) =>
  migrationArray.some(
    (migrationItem: ContentType) => migrationItem.sys.id === contentType.sys.id
  );

/**
 *
 * @param mainBranch
 * @param currentEnvironment
 * @returns
 */
export const isOnMainBranch = (
  mainBranch: ContentfulEnvironmentWithContentTypes,
  currentEnvironment: ContentfulEnvironmentWithContentTypes
) => mainBranch?.environment.sys.id === currentEnvironment?.environment.sys.id;

/**
 *
 * @param param0
 * @returns
 */
export const shouldCheckBoxBeHidden = ({
  mainBranch,
  contentType,
  field,
  isOnMain,
}: {
  mainBranch: ContentfulEnvironmentWithContentTypes;
  contentType: ContentType;
  field?: ContentFields<KeyValueMap>;
  isOnMain: boolean;
}) =>
  !isOnMain
    ? !field
      ? !isContentTypeInSync(mainBranch!, contentType)
      : !isFieldExisting(mainBranch!, contentType, field) ||
        !isFieldInSync(mainBranch!, contentType, field)
    : false;
