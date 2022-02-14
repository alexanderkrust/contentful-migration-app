import { Badge } from '@chakra-ui/react';
import { ContentFields, ContentType, KeyValueMap } from 'contentful-management';
import { SpaceData } from '../../../api';
import { getContentTypeInfoInMaster, getFieldIndex } from '../utils';

interface FieldBadgeProps {
  contentType: ContentType;
  spaceData: SpaceData;
  field: ContentFields<KeyValueMap>;
}

export function FieldBadge({ contentType, spaceData, field }: FieldBadgeProps) {
  /**
   * TODO: Write JSDoc
   * @param contentType
   * @param field
   * @returns
   */
  const isFieldExisting = () => {
    const info = getContentTypeInfoInMaster(spaceData, contentType);
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
   * TODO: Write JSDoc
   * @param contentType
   * @param field
   * @returns
   */
  const isFieldInSync = () => {
    const info = getContentTypeInfoInMaster(spaceData, contentType);
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
  // eslint-disable-next-line no-nested-ternary
  return isFieldExisting() ? (
    isFieldInSync() ? (
      <Badge colorScheme="green">Synced with master</Badge>
    ) : (
      <Badge colorScheme="purple">Not in sync with master</Badge>
    )
  ) : (
    <Badge colorScheme="red"> Field missing in master</Badge>
  );
}
