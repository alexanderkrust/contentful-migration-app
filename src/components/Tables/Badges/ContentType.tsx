import { Badge } from '@chakra-ui/react';
import { ContentType } from 'contentful-management';
import { useRecoilValue } from 'recoil';
import { mainBranchState } from '../../../state/settings';
import { currentEnvironmentState } from '../../../state/space';
import { isContentTypeInSync } from '../utils';

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

  const isContentTypeInSyncWithMainBranch = isContentTypeInSync(
    mainBranch!,
    contentType
  );

  return isContentTypeInSyncWithMainBranch ? (
    <Badge colorScheme="green">Synced with main</Badge>
  ) : (
    <Badge colorScheme="purple">Not in sync with main</Badge>
  );
}
