/* eslint-disable no-nested-ternary */
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
import { ContentType } from 'contentful-management';
import { Fragment, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ContentfulEnvironmentWithContentTypes } from '../../api';
import { migrationItemsState } from '../../state/migrate';
import { currentEnvironmentState, spaceState } from '../../state/space';
import {
  getContentTypeIndex,
  isContentTypeInMigrationArray,
  isOnMainBranch,
  shouldCheckBoxBeHidden,
} from './utils';
import { ContentTypeBadge } from './Badges/ContentType';
import { mainBranchState } from '../../state/settings';
import { FieldsTable } from './Field/Table';

interface ContentTypesTableProps {
  environmentWithContentTypes: ContentfulEnvironmentWithContentTypes;
}

const TABLE_SETTINGS = {
  main: {
    colCount: 2,
  },
  others: {
    colCount: 4,
  },
};

export function ContentTypesTable({
  environmentWithContentTypes,
}: ContentTypesTableProps) {
  const [collapsedItems, setCollapsedItems] = useState<number[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [spaceData, _] = useRecoilState(spaceState);

  const mainBranch = useRecoilValue(mainBranchState);
  const currentEnvironment = useRecoilValue(currentEnvironmentState);

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
   * @param index
   */
  const handleOnContentTypeSelected = (
    contentType: ContentType,
    index: number
  ) => {
    const contentTypeIndex = getContentTypeIndex(contentType, migrationItems);

    if (contentTypeIndex >= 0) {
      removeConentTypeFromMigrationItems(contentTypeIndex);
    } else {
      if (!isOpen(index)) {
        handleOnClick(index);
      }
      setMigrationItems([...migrationItems, contentType]);
    }
  };

  const isOnMain = isOnMainBranch(mainBranch!, currentEnvironment!);

  const getWidth = () =>
    isOnMain
      ? `${100 / TABLE_SETTINGS.main.colCount}%`
      : `${100 / TABLE_SETTINGS.others.colCount}%`;

  const width = getWidth();

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
            <Th width={width}>Content Type</Th>
            {!isOnMain && <Th width={width}>Status</Th>}
            <Th width={width}>Fields</Th>
            {!isOnMain && <Th width={width}>Select</Th>}
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
                  <Td width={width}>
                    <Text marginRight="2" fontWeight="bold">
                      {contentType?.name}
                    </Text>
                  </Td>

                  {!isOnMain && (
                    <Td width={width}>
                      {!!spaceData && (
                        <ContentTypeBadge contentType={contentType} />
                      )}
                    </Td>
                  )}

                  <Td width={width}>
                    {contentType?.fields?.length ?? 'No fields added yet..'}
                  </Td>

                  {shouldCheckBoxBeHidden({
                    contentType,
                    mainBranch: mainBranch!,
                    isOnMain,
                  }) && (
                    <Td
                      width={width}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Checkbox
                        as="div"
                        size="lg"
                        isChecked={isContentTypeInMigrationArray(
                          contentType,
                          migrationItems
                        )}
                        onChange={() =>
                          handleOnContentTypeSelected(contentType, index)
                        }
                      />
                    </Td>
                  )}
                </Tr>
                <Tr>
                  <Td colSpan={4} padding="0" border="none">
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
                        <FieldsTable
                          contentType={contentType}
                          isOnMainBranch={isOnMain}
                          width={width}
                          removeConentTypeFromMigrationItems={
                            removeConentTypeFromMigrationItems
                          }
                        />
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
