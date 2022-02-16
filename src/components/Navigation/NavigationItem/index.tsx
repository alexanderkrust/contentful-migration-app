import { Box, HStack, Icon, Text, theme } from '@chakra-ui/react';
import { Environment } from 'contentful-management';
import { Hierarchy2 } from 'iconsax-react';

interface NavigationItemProps {
  environment: Environment;
  // eslint-disable-next-line react/require-default-props
  active?: boolean;
  isMain: boolean;
  handleOnClick: () => void;
}

const color = theme.colors.teal['500'];

export function NavigationItem({
  environment,
  active,
  isMain,
  handleOnClick,
}: NavigationItemProps) {
  return (
    <Box paddingY="2">
      <Box
        transition="all 0.3s ease"
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
            padding="5px"
            marginRight="4px"
            transition="all 0.3s ease"
            backgroundColor={active ? `${color}` : 'white'}
          >
            <Icon
              display="flex"
              justifyContent="center"
              color={active ? 'white' : `${color}`}
              width="13px"
              height="13px"
              as={Hierarchy2}
              transition="all 0.3s ease"
            />
          </Box>

          <Box>
            <Text
              transition="all 0.3s ease"
              fontWeight="bold"
              fontSize="sm"
              textTransform="capitalize"
              color={active ? 'black' : `${color}`}
              letterSpacing="0.5px"
            >
              {environment?.name}
            </Text>
            {isMain && (
              <Box
                display="inline-block"
                padding="0px 6px 1px 6px"
                borderRadius="md"
                border={`1px solid ${color}`}
              >
                <Text
                  isTruncated
                  lineHeight="1.2"
                  color={color}
                  fontWeight="bold"
                  letterSpacing="0.5px"
                  fontSize="xs"
                >
                  main
                </Text>
              </Box>
            )}
          </Box>
        </HStack>
      </Box>
    </Box>
  );
}
