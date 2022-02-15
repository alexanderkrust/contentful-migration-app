import { ContentFields, ContentType, KeyValueMap } from 'contentful-management';
import { ContentfulEnvironmentWithContentTypes } from '../../api';

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
 * TODO: Write JSDoc
 * @param contentTypeIndex
 * @param field
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
