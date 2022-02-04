import {
  Box,
  Collapse,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentEnvironmentState } from '../../state/space';

export function ContentTypesTable() {
  const currentEnvironment = useRecoilValue(currentEnvironmentState);
  const [collapsedItems, setCollapsedItems] = useState<number[]>([]);

  useEffect(() => {
    setCollapsedItems([]);
  }, [currentEnvironment]);

  const handleOnClick = (index: number) => {
    if (collapsedItems.includes(index)) {
      setCollapsedItems(collapsedItems.filter((item) => item !== index));
    } else {
      setCollapsedItems([...collapsedItems, index]);
    }
  };

  const isOpen = (index: number) => collapsedItems.includes(index);

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
          </Tr>
        </Thead>
        <Tbody>
          {currentEnvironment?.contentTypes.map((contentType, index) => (
            <>
              <Tr
                key={contentType?.sys?.id}
                onClick={() => handleOnClick(index)}
                cursor="pointer"
              >
                <Td>{contentType?.name}</Td>
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
              </Tr>
              <Tr>
                <Collapse in={isOpen(index)} animateOpacity>
                  <Table size="md">
                    <Thead>
                      <Th>Field Name</Th>
                    </Thead>
                    <Tbody>
                      {contentType?.fields?.map((field) => (
                        <Tr>
                          <Td>{field?.name}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Collapse>
              </Tr>
            </>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
