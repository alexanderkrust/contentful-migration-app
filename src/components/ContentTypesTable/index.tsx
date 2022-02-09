import {
  Box,
  Checkbox,
  Collapse,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  theme,
  Tr,
} from '@chakra-ui/react';
import { ContentFields, ContentType, KeyValueMap } from 'contentful-management';
import { Fragment, useState } from 'react';
import { useRecoilState } from 'recoil';
import { ContentfulEnvironmentWithContentTypes } from '../../api';
import { migrationItemsState } from '../../state/migrate';

interface ContentTypesTableProps {
  environmentWithContentTypes: ContentfulEnvironmentWithContentTypes;
}

export function ContentTypesTable({
  environmentWithContentTypes,
}: ContentTypesTableProps) {
  const [collapsedItems, setCollapsedItems] = useState<number[]>([]);

  const [migrationItems, setMigrationItems] =
    useRecoilState(migrationItemsState);

  /**
   * TODO: Write JSDoc
   * @param index
   */
  const handleOnClick = (index: number) => {
    if (collapsedItems.includes(index)) {
      setCollapsedItems(collapsedItems.filter((item) => item !== index));
    } else {
      setCollapsedItems([...collapsedItems, index]);
    }
  };

  /**
   * TODO: Write JSDoc
   * @param index
   * @returns
   */
  const isOpen = (index: number) => collapsedItems.includes(index);

  /**
   * TODO: Write JSDoc
   * @param contentType
   * @returns
   */
  const getMigrationItemIndex = (contentType: ContentType) =>
    migrationItems.findIndex(
      (migrationItem: ContentType) =>
        migrationItem.sys.id === contentType.sys.id
    );

  /**
   * TODO: Write JSDoc
   * @param contentTypeIndex
   * @param field
   * @returns
   */
  const getFieldIndex = (
    contentTypeIndex: number,
    field: ContentFields<KeyValueMap>
  ) =>
    migrationItems[contentTypeIndex].fields.findIndex(
      (fieldItem) => fieldItem.id === field.id
    );

  /**
   * TODO: Write JSDoc
   * @param contentTypeIndex
   */
  const removeConentTypeFromMigrationItems = (contentTypeIndex: number) => {
    const newArray = [...migrationItems];
    newArray.splice(contentTypeIndex, 1);
    setMigrationItems(newArray);
  };

  /**
   * TODO: Write JSDoc
   * @param contentType
   * @param field
   * @returns
   */
  const handleOnFieldSelected = (
    contentType: ContentType,
    field: ContentFields<KeyValueMap>
  ) => {
    const contentTypeIndex = getMigrationItemIndex(contentType);

    if (contentTypeIndex >= 0) {
      const fieldIndex = getFieldIndex(contentTypeIndex, field);

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

  /**
   * TODO: Write JSDoc
   * @param contentType
   * @param index
   */
  const handleOnContentTypeSelected = (
    contentType: ContentType,
    index: number
  ) => {
    const itemIndex = getMigrationItemIndex(contentType);

    if (itemIndex >= 0) {
      removeConentTypeFromMigrationItems(itemIndex);
    } else {
      if (!isOpen(index)) {
        handleOnClick(index);
      }
      setMigrationItems([...migrationItems, contentType]);
    }
  };

  /**
   * TODO: Write JSDoc
   * @param contentType
   * @returns
   */
  const isContentTypeInMigrationArray = (contentType: ContentType) =>
    migrationItems.some(
      (migrationItem: ContentType) =>
        migrationItem.sys.id === contentType.sys.id
    );

  /**
   * TODO: Write JSDoc
   * @param contentType
   * @param field
   * @returns
   */
  const isFieldSelected = (
    contentType: ContentType,
    field: ContentFields<KeyValueMap>
  ) => {
    if (!isContentTypeInMigrationArray(contentType)) {
      return false;
    }

    const index = getMigrationItemIndex(contentType);

    return getFieldIndex(index, field) >= 0;
  };

  return (
    <Box
      marginTop="25px"
      paddingX="4"
      paddingY="6"
      backgroundColor="white"
      borderRadius="xl"
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Content Type</Th>
            <Th>fields</Th>
            <Th>published</Th>
            <Th>updated</Th>
            <Th>select</Th>
          </Tr>
        </Thead>
        <Tbody>
          {environmentWithContentTypes?.contentTypes.map(
            (contentType, index) => (
              <Fragment key={contentType?.sys?.id}>
                <Tr
                  zIndex="1"
                  key={contentType?.sys?.id}
                  onClick={() => handleOnClick(index)}
                  cursor="pointer"
                >
                  <Td>
                    <Text fontWeight="bold">{contentType?.name}</Text>
                  </Td>
                  <Td>
                    {contentType?.fields?.length ?? 'No fields added yet..'}
                  </Td>
                  <Td>
                    {new Intl.DateTimeFormat('en-US').format(
                      new Date(contentType?.sys?.firstPublishedAt ?? '')
                    )}
                  </Td>
                  <Td>
                    {new Intl.DateTimeFormat('en-US').format(
                      new Date(contentType?.sys?.updatedAt ?? '')
                    )}
                  </Td>

                  <Td onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      as="div"
                      size="lg"
                      isChecked={isContentTypeInMigrationArray(contentType)}
                      onChange={() =>
                        handleOnContentTypeSelected(contentType, index)
                      }
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={5} padding="0" border="none">
                    <Box
                      padding={isOpen(index) ? '3' : '0'}
                      transition=".2s all"
                    >
                      <Collapse
                        in={isOpen(index)}
                        style={{
                          width: '100%',
                          backgroundColor: `${theme.colors.teal['50']}`,
                          borderRadius: `0.75rem`,
                        }}
                      >
                        <Box padding="4">
                          <Table size="md">
                            <Thead>
                              <Tr>
                                <Th>Field Name</Th>
                                <Th>Type</Th>
                                <Th>Select</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {contentType?.fields?.map((field) => (
                                <Tr key={field.id}>
                                  <Td>{field?.name}</Td>
                                  <Td>{field?.type}</Td>
                                  <Td>
                                    <Checkbox
                                      size="lg"
                                      isChecked={isFieldSelected(
                                        contentType,
                                        field
                                      )}
                                      onChange={() =>
                                        handleOnFieldSelected(
                                          contentType,
                                          field
                                        )
                                      }
                                    />
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Box>
                      </Collapse>
                    </Box>
                  </Td>
                </Tr>
              </Fragment>
            )
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
