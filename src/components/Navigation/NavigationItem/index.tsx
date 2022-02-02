import { Box, HStack, Text, theme } from '@chakra-ui/react';
import { Environment } from 'contentful-management';
import { Hierarchy2 } from 'iconsax-react';

interface NavigationItemProps {
  environment: Environment;
  // eslint-disable-next-line react/require-default-props
  active?: boolean;
  handleOnClick: () => void;
}

const color = theme.colors.teal['500'];

export function NavigationItem({
  environment,
  active,
  handleOnClick,
}: NavigationItemProps) {
  return (
    <Box paddingY="2">
      <Box
        role="button"
        padding="3"
        borderRadius="xl"
        boxShadow={active ? 'sm' : undefined}
        backgroundColor={active ? 'white' : 'transparent'}
        onClick={handleOnClick}
        cursor="pointer"
      >
        <HStack>
          <Box
            borderRadius="lg"
            padding="6px"
            marginRight="4px"
            backgroundColor={active ? `${color}` : 'white'}
          >
            <Hierarchy2
              color={active ? 'white' : `${color}`}
              variant="Linear"
              size={12}
            />
          </Box>

          <Text
            fontWeight="bold"
            fontSize="sm"
            textTransform="capitalize"
            color={active ? 'black' : `${color}`}
            letterSpacing="0.5px"
          >
            {environment?.name}
          </Text>
        </HStack>
      </Box>
    </Box>
  );
}
