import { Box, theme, useDisclosure } from '@chakra-ui/react';
import { Setting2 } from 'iconsax-react';
import { SettingsDrawer } from '../../Drawer/SettingsDrawer';

export function SettingsButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        role="button"
        cursor="pointer"
        padding="2"
        borderRadius="lg"
        onClick={onOpen}
        boxShadow="xs"
      >
        <Setting2 size="24" color={theme.colors.teal[500]} />
      </Box>
      <SettingsDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
}
