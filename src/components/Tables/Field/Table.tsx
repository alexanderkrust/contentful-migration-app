import {
  Badge,
  Box,
  /* Checkbox, */
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ContentType } from 'contentful-management';
import { useRecoilState /* , useRecoilValue */ } from 'recoil';
import { migrationItemsState } from '../../../state/migrate';
/* import { mainBranchState } from '../../../state/settings'; */
import { FieldBadge } from '../Badges/Field';
/* import { shouldCheckBoxBeHidden } from '../utils'; */
import {
  /* handleOnFieldSelected, */
  isDisplayField,
  /* isFieldSelected, */
} from './utils';

interface FieldsTableProps {
  width: string;
  isOnMainBranch: boolean;
  contentType: ContentType;
  // eslint-disable-next-line no-unused-vars
  /* removeConentTypeFromMigrationItems: (contentTypeIndex: number) => void; */
}

export function FieldsTable({
  width,
  isOnMainBranch,
  contentType,
}: /* removeConentTypeFromMigrationItems, */
FieldsTableProps) {
  // eslint-disable-next-line no-unused-vars
  const [migrationItems, setMigrationItems] =
    useRecoilState(migrationItemsState);

  /* const mainBranch = useRecoilValue(mainBranchState); */

  return (
    <>
      <Heading
        marginTop="1.5"
        marginBottom="2.5"
        size="xs"
        textTransform="uppercase"
        fontWeight="bold"
        letterSpacing="0.5px"
        color="gray.600"
      >
        Fields
      </Heading>
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
            {contentType?.fields?.map((field) => (
              <Tr key={field.id}>
                <Td width={width}>
                  <Text display="inline-block" fontWeight="semibold">
                    {field?.id}
                  </Text>
                  {isDisplayField(field, contentType) && (
                    <Badge variant="solid" marginLeft="2">
                      Displayfield
                    </Badge>
                  )}
                </Td>

                {!isOnMainBranch && (
                  <Td width={width}>
                    <FieldBadge contentType={contentType} field={field} />
                  </Td>
                )}

                <Td width={width}>
                  <Text display="inline-block" fontWeight="semibold">
                    {field?.type}
                  </Text>
                </Td>
                {/* {shouldCheckBoxBeHidden({
                  isOnMain: isOnMainBranch,
                  mainBranch: mainBranch!,
                  contentType,
                  field,
                }) && (
                  <Td width={width}>
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
                          contentType,
                          migrationItems,
                          setMigrationItems,
                          removeConentTypeFromMigrationItems
                        )
                      }
                    />
                  </Td>
                )} */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
