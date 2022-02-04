import { Box } from '@chakra-ui/react';
import { ContentTypesTable } from '../../components/ContentTypesTable';

export function Main() {
  return (
    <Box height="100%" paddingX={10} paddingY={15}>
      <ContentTypesTable />
    </Box>
  );
}
