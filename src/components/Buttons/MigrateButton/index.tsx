import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { migrationItemsState } from '../../../state/migrate';
import { MigrateModal } from '../../Modal/MigrateModal';

export function MigrateButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // eslint-disable-next-line no-unused-vars
  const [migrationItems, setMigrationItems] =
    useRecoilState(migrationItemsState);

  if (migrationItems?.length === 0) {
    return null;
  }
  return (
    <>
      <Box position="fixed" bottom="10" right="10" padding="5" onClick={onOpen}>
        <Button colorScheme="teal" size="lg">
          Migrate
        </Button>
      </Box>
      <MigrateModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
