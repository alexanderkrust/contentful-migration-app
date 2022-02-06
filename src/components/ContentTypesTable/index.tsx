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
import { useEffect, useState } from 'react';
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

  // eslint-disable-next-line no-unused-vars
  const [migrationItems, setMigrationItems] =
    useRecoilState(migrationItemsState);

  useEffect(() => {
    console.log(migrationItems);
  }, [migrationItems]);

  const handleOnClick = (index: number) => {
    if (collapsedItems.includes(index)) {
      setCollapsedItems(collapsedItems.filter((item) => item !== index));
    } else {
      setCollapsedItems([...collapsedItems, index]);
    }
  };

  const isOpen = (index: number) => collapsedItems.includes(index);

  const handleOnFieldSelected = (
    contentType: ContentType,
    field: ContentFields<KeyValueMap>
  ) => {
    const index = migrationItems.findIndex(
      (migrationItem: ContentType) =>
        migrationItem.sys.id === contentType.sys.id
    );

    console.log(contentType, field, index);
    // Check for ContentType
    // check for added fields in each ContentType
    /* if (index >= 0) {
      const newArray = [...migrationItems];
      newArray.splice(index, 1);
      console.log(newArray);
      setMigrationItems(newArray);
    } else {
      const newArray = [...migrationItems];
      newArray.push(contentType);
      console.log(newArray);
      setMigrationItems(newArray);
    } */
  };

  const handleOnContentTypeSelected = (contentType: ContentType) => {
    console.log(contentType);
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
            <Th>Selected</Th>
          </Tr>
        </Thead>
        <Tbody>
          {environmentWithContentTypes?.contentTypes.map(
            (contentType, index) => (
              <>
                <Tr
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
                  <Td>
                    <Checkbox
                      size="lg"
                      onChange={() => handleOnContentTypeSelected(contentType)}
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
                              <Th>Field Name</Th>
                              <Th>Type</Th>
                              <Th>Select</Th>
                            </Thead>
                            <Tbody>
                              {contentType?.fields?.map((field) => (
                                <Tr>
                                  <Td>{field?.name}</Td>
                                  <Td>{field?.type}</Td>
                                  <Td>
                                    <Checkbox
                                      size="lg"
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
              </>
            )
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
