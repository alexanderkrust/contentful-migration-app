import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { ArrowSwapVertical } from 'iconsax-react';
import { useRecoilState } from 'recoil';
import { migrationItemsState } from '../../../state/migrate';
import { MigrateDrawer } from '../../Drawer/MigrateDrawer';

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
      <Box
        maxWidth="1440px"
        left="0"
        right="0"
        height="50px"
        pos="fixed"
        paddingX="10"
        margin="0 auto"
        bottom="0"
      >
        <Button
          position="absolute"
          right="10"
          bottom="7"
          colorScheme="teal"
          size="lg"
          onClick={onOpen}
          boxShadow="xl"
          leftIcon={<ArrowSwapVertical size="22" color="#fff" variant="Bold" />}
        >
          Migrate
        </Button>
      </Box>

      <MigrateDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
}
