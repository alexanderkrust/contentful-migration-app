import { Box } from '@chakra-ui/react';
import { ReactComponent as CLogo } from '../../images/contentful-logo.svg';

function Logo() {
  return (
    <Box
      height="32px"
      width="32px"
      display="flex"
      alignItems="center"
      marginRight="5px"
    >
      <CLogo />
    </Box>
  );
}

export default Logo;
