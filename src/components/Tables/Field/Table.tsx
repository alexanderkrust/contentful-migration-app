import {
  Badge,
  Box,
  Checkbox,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ContentFields, ContentType, KeyValueMap } from 'contentful-management';
import { useRecoilState, useRecoilValue } from 'recoil';
import { migrationItemsState } from '../../../state/migrate';
import { mainBranchState } from '../../../state/settings';
import { FieldBadge } from '../Badges/Field';
import {
  getContentTypeIndex,
  getFieldIndex,
  isContentTypeInMigrationArray,
  shouldCheckBoxBeHidden,
} from '../utils';

interface FieldsTableProps {
  width: string;
  isOnMainBranch: boolean;
  contentType: ContentType;
  // eslint-disable-next-line no-unused-vars
  removeConentTypeFromMigrationItems: (contentTypeIndex: number) => void;
}

export function FieldsTable({
  width,
  isOnMainBranch,
  contentType,
  removeConentTypeFromMigrationItems,
}: FieldsTableProps) {
  // eslint-disable-next-line no-unused-vars
  const [migrationItems, setMigrationItems] =
    useRecoilState(migrationItemsState);

  const mainBranch = useRecoilValue(mainBranchState);

  const isDisplayField = (field: ContentFields<KeyValueMap>) =>
    field.id === contentType.displayField;

  /**
   * TODO: Write JSDoc
   * @param contentType
   * @param field
   * @returns
   */
  const isFieldSelected = (field: ContentFields<KeyValueMap>) => {
    if (!isContentTypeInMigrationArray(contentType, migrationItems)) {
      return false;
    }

    const contentTypeIndex = getContentTypeIndex(contentType, migrationItems);

    return getFieldIndex(contentTypeIndex, field, migrationItems) >= 0;
  };

  /**
   * TODO: Write JSDoc
   * @param contentType
   * @param field
   * @returns
   */
  const handleOnFieldSelected = (field: ContentFields<KeyValueMap>) => {
    const contentTypeIndex = getContentTypeIndex(contentType, migrationItems);

    if (contentTypeIndex >= 0) {
      const fieldIndex = getFieldIndex(contentTypeIndex, field, migrationItems);

      const contentTypes = [...migrationItems];
      const contentTypeByIndex = contentTypes[contentTypeIndex];
      const contentTypeFields = [...contentTypeByIndex.fields];

      // if field exitsts in migrationItems, remove it
      if (fieldIndex >= 0) {
        if (contentTypeFields.length === 1) {
          removeConentTypeFromMigrationItems(contentTypeIndex);
          return;
        }

        contentTypeFields.splice(fieldIndex, 1);
        contentTypes[contentTypeIndex] = {
          ...contentTypeByIndex,
          fields: contentTypeFields,
        };
        setMigrationItems(contentTypes);
        return;
        // if field doesn't exist in migrationItems, add it
      }

      contentTypeFields.push(field);
      contentTypes[contentTypeIndex] = {
        ...contentTypeByIndex,
        fields: contentTypeFields,
      };
      setMigrationItems(contentTypes);
      // if contentType doesnt exist in the array, add it with selected field
    } else {
      setMigrationItems([
        ...migrationItems,
        {
          ...contentType,
          fields: contentType.fields.filter(
            (fieldItem) => fieldItem.id === field.id
          ),
        },
      ]);
    }
  };

  return (
    <Box padding="4">
      <Table size="md">
        <Thead>
          <Tr>
            <Th width={width}>Field Id</Th>
            {!isOnMainBranch && <Th width={width}>Status</Th>}
            <Th width={width}>Type</Th>
            {!isOnMainBranch && <Th width={width}>Select</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {contentType?.fields?.map((field) => (
            <Tr key={field.id}>
              <Td width={width}>
                {field?.id}
                {isDisplayField(field) && (
                  <Badge marginLeft="2">Displayfield</Badge>
                )}
              </Td>

              {!isOnMainBranch && (
                <Td width={width}>
                  <FieldBadge contentType={contentType} field={field} />
                </Td>
              )}

              <Td width={width}>{field?.type}</Td>
              {shouldCheckBoxBeHidden({
                isOnMain: isOnMainBranch,
                mainBranch: mainBranch!,
                contentType,
                field,
              }) && (
                <Td width={width}>
                  <Checkbox
                    size="lg"
                    isChecked={isFieldSelected(field)}
                    onChange={() => handleOnFieldSelected(field)}
                  />
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
