import { Badge } from '@chakra-ui/react';
import { ContentType } from 'contentful-management';
import { useRecoilValue } from 'recoil';
import { mainBranchState } from '../../../state/settings';
import { currentEnvironmentState } from '../../../state/space';
import { getContentTypeInfoInMaster } from '../utils';

interface ContentTypeBadgeProps {
  contentType: ContentType;
}

export function ContentTypeBadge({ contentType }: ContentTypeBadgeProps) {
  const mainBranch = useRecoilValue(mainBranchState);
  const currentEnvironment = useRecoilValue(currentEnvironmentState);

  if (
    mainBranch?.environment.sys.id === currentEnvironment?.environment.sys.id
  ) {
    return null;
  }

  /**
   * TODO: Write JSDoc
   * @param contentType
   * @returns
   */
  const isContentTypeInSyncWithMaster = () => {
    const info = getContentTypeInfoInMaster(mainBranch!, contentType);
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
  return isContentTypeInSyncWithMaster() ? (
    <Badge colorScheme="green">Synced with main</Badge>
  ) : (
    <Badge colorScheme="purple">Not in sync with main</Badge>
  );
}
