import { Box, Button } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { migrationItemsState } from '../../state/migrate';

export function MigratePanel() {
  // eslint-disable-next-line no-unused-vars
  const [migrationItems, setMigrationItems] =
    useRecoilState(migrationItemsState);

  if (migrationItems?.length === 0) {
    return null;
  }
  return (
    <Box position="fixed" bottom="10" right="10" padding="5">
      <Button colorScheme="teal" size="lg">
        Migrate
      </Button>
    </Box>
  );
}
