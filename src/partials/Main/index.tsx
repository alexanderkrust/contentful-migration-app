import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ContentTypesTable } from '../../components/ContentTypesTable';
import { migrationItemsState } from '../../state/migrate';
import { currentEnvironmentState, spaceState } from '../../state/space';

export function Main() {
  const currentEnvironment = useRecoilValue(currentEnvironmentState);
  // eslint-disable-next-line no-unused-vars
  const [spaceData, _] = useRecoilState(spaceState);
  // eslint-disable-next-line no-unused-vars
  const [__, setMigrationItems] = useRecoilState(migrationItemsState);

  useEffect(() => {
    setMigrationItems([]);
  }, [currentEnvironment]);

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
              key={environmentWithContentTypes?.environment?.sys?.id}
              environmentWithContentTypes={environmentWithContentTypes}
            />
          );
        }
      )}
    </Box>
  );
}
