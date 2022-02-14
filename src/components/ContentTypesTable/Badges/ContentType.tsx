import { Badge } from '@chakra-ui/react';
import { ContentType } from 'contentful-management';
import { SpaceData } from '../../../api';
import { getContentTypeInfoInMaster } from '../utils';

interface ContentTypeBadgeProps {
  contentType: ContentType;
  spaceData: SpaceData;
}

export function ContentTypeBadge({
  contentType,
  spaceData,
}: ContentTypeBadgeProps) {
  /**
   * TODO: Write JSDoc
   * @param contentType
   * @returns
   */
  const isContentTypeInSyncWithMaster = () => {
    const info = getContentTypeInfoInMaster(spaceData, contentType);
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
      const fieldInMasterConentType = contentTypesInMaster[
        contentTypeIndex
      ].fields.find((fieldItem) => fieldItem.id === field.id);
      return (
        fieldInMasterConentType &&
        JSON.stringify(field) === JSON.stringify(fieldInMasterConentType)
      );
    });

    return inSync;
  };
  return isContentTypeInSyncWithMaster() ? (
    <Badge colorScheme="green">Synced with master</Badge>
  ) : (
    <Badge colorScheme="purple">Not in sync with master</Badge>
  );
}
