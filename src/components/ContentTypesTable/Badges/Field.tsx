import { Badge } from '@chakra-ui/react';
import { ContentFields, ContentType, KeyValueMap } from 'contentful-management';
import { useRecoilValue } from 'recoil';
import { mainBranchState } from '../../../state/settings';
import { currentEnvironmentState } from '../../../state/space';
import { getContentTypeInfoInMaster, getFieldIndex } from '../utils';

interface FieldBadgeProps {
  contentType: ContentType;
  field: ContentFields<KeyValueMap>;
}

export function FieldBadge({ contentType, field }: FieldBadgeProps) {
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
   * @param field
   * @returns
   */
  const isFieldExisting = () => {
    const info = getContentTypeInfoInMaster(mainBranch!, contentType);
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
    const info = getContentTypeInfoInMaster(mainBranch!, contentType);
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
      <Badge colorScheme="green">Synced with main</Badge>
    ) : (
      <Badge colorScheme="purple">Not in sync with main</Badge>
    )
  ) : (
    <Badge colorScheme="red"> Field missing in main</Badge>
  );
}
