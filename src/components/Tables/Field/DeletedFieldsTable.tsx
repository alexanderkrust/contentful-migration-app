import {
  Badge,
  Box,
  /* Checkbox, */
  Flex,
  Heading,
  /* Checkbox, */
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { ContentType } from 'contentful-management';
import { InfoCircle } from 'iconsax-react';
import { /* useRecoilState, */ useRecoilValue } from 'recoil';
/* import { migrationItemsState } from '../../../state/migrate'; */
import { mainBranchState } from '../../../state/settings';
import {
  /* handleOnFieldSelected, */
  isDisplayField,
  /* isFieldSelected, */
} from './utils';

interface DeletedFieldsTableProps {
  contentType: ContentType;
  isOnMainBranch: boolean;
  width: string;
  // eslint-disable-next-line no-unused-vars
  /* removeConentTypeFromMigrationItems: (contentTypeIndex: number) => void; */
}

export function DeletedFieldsTable({
  contentType,
  isOnMainBranch,
  width,
}: /* removeConentTypeFromMigrationItems, */
DeletedFieldsTableProps) {
  if (isOnMainBranch) {
    return null;
  }
  /* const [migrationItems, setMigrationItems] =
    useRecoilState(migrationItemsState); */

  const mainBranch = useRecoilValue(mainBranchState);
  const contentTypeOnMainBranch = mainBranch?.contentTypes.find(
    (cType) => cType.sys.id === contentType.sys.id
  );

  const contentTypeCopy = { ...contentTypeOnMainBranch } as ContentType;

  const difference = contentTypeCopy?.fields?.filter((field) => {
    const index = contentType?.fields.findIndex(
      (fieldOnMain) => fieldOnMain.id === field.id
    );
    return index === -1;
  });

  if (difference?.length === 0) {
    return null;
  }

  contentTypeCopy.fields = difference;

  return (
    <>
      <Flex alignItems="center" marginTop="8" marginBottom="2.5">
        <Heading
          size="xs"
          textTransform="uppercase"
          fontWeight="bold"
          letterSpacing="0.5px"
          color="gray.600"
        >
          Deleted Fields
        </Heading>
        <Box marginLeft="2" cursor="pointer">
          <Tooltip
            borderRadius="lg"
            padding="2"
            placement="top"
            label={
              <Text maxWidth="150px" wordBreak="break-word">
                The fields listed in this table, gonna be deleted in the main
                branch.
              </Text>
            }
            aria-label="Deleted fields tooltop"
          >
            <InfoCircle size="18" color="#000" />
          </Tooltip>
        </Box>
      </Flex>
      <Box padding="4" backgroundColor="teal.50" borderRadius="0.75rem">
        <Table size="md">
          <Thead>
            <Tr>
              <Th width={width}>Field Id</Th>
              {!isOnMainBranch && <Th width={width}>Status</Th>}
              <Th width={width}>Type</Th>
              {/* {!isOnMainBranch && <Th width={width}>Select</Th>} */}
            </Tr>
          </Thead>
          <Tbody>
            {contentTypeCopy?.fields?.map((field) => (
              <Tr key={field.id}>
                <Td width={width}>
                  <Text display="inline-block" fontWeight="semibold">
                    {field?.id}
                  </Text>
                  {isDisplayField(field, contentType) && (
                    <Badge marginLeft="2">Displayfield</Badge>
                  )}
                </Td>

                {!isOnMainBranch && (
                  <Td width={width}>
                    <Badge variant="outline" colorScheme="red">
                      exists in main
                    </Badge>
                  </Td>
                )}

                <Td width={width}>
                  <Text display="inline-block" fontWeight="semibold">
                    {field?.type}
                  </Text>
                </Td>

                {/* <Td width={width}>
                  <Checkbox
                    size="lg"
                    isChecked={isFieldSelected(
                      field,
                      contentType,
                      migrationItems
                    )}
                    onChange={() =>
                      handleOnFieldSelected(
                        field,
                        contentTypeCopy,
                        migrationItems,
                        setMigrationItems,
                        removeConentTypeFromMigrationItems
                      )
                    }
                  />
                </Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
