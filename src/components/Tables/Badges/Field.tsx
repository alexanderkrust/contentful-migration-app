import { Badge } from '@chakra-ui/react';
import { ContentFields, ContentType, KeyValueMap } from 'contentful-management';
import { useRecoilValue } from 'recoil';
import { mainBranchState } from '../../../state/settings';
import { currentEnvironmentState } from '../../../state/space';
import { isFieldExisting, isFieldInSync } from '../Field/utils';

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

  const isFieldExistinginMainBranch = isFieldExisting(
    mainBranch!,
    contentType,
    field
  );

  const isFieldInSyncWithMainBranch = isFieldInSync(
    mainBranch!,
    contentType,
    field
  );

  // eslint-disable-next-line no-nested-ternary
  return isFieldExistinginMainBranch ? (
    isFieldInSyncWithMainBranch ? (
      <Badge colorScheme="green">Synced with main</Badge>
    ) : (
      <Badge colorScheme="purple">Not in sync with main</Badge>
    )
  ) : (
    <Badge colorScheme="red"> Field missing in main</Badge>
  );
}
