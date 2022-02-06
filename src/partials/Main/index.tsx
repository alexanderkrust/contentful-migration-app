import { Box } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ContentTypesTable } from '../../components/ContentTypesTable';
import { currentEnvironmentState, spaceState } from '../../state/space';

export function Main() {
  const currentEnvironment = useRecoilValue(currentEnvironmentState);
  // eslint-disable-next-line no-unused-vars
  const [spaceData, _] = useRecoilState(spaceState);

  return (
    <Box height="100%" paddingX={10} paddingY={15}>
      {spaceData?.environmentsWithContentTypes.map(
        (environmentWithContentTypes) => {
          if (
            environmentWithContentTypes.environment.sys.id !==
            currentEnvironment?.environment?.sys?.id
          ) {
            return null;
          }
          return (
            <ContentTypesTable
              environmentWithContentTypes={environmentWithContentTypes}
            />
          );
        }
      )}
    </Box>
  );
}
