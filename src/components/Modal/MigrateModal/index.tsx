/* eslint-disable no-await-in-loop */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  VStack,
  HStack,
  Flex,
  Text,
  Divider,
  theme,
  Select,
} from '@chakra-ui/react';
import { ArrowSwapHorizontal, Card, Hierarchy2 } from 'iconsax-react';
import { ChangeEvent, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { migrationItemsState } from '../../../state/migrate';
import {
  allEnvironmentState,
  currentEnvironmentState,
  triggerState,
} from '../../../state/space';

import {
  createContentType,
  /* createContentType, */
  getEnvironement,
  updateContentType,
} from '../../../api/contentType/migrations';

interface MigrateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MigrateModal({ isOpen, onClose }: MigrateModalProps) {
  const allEnvironments = useRecoilValue(allEnvironmentState);
  // eslint-disable-next-line no-unused-vars
  const [targetEnvironment, setTragetEnvironment] = useState(
    allEnvironments && allEnvironments[0]?.name
  );

  // eslint-disable-next-line no-unused-vars
  const [fetchTrigger, setFetchTrigger] = useRecoilState(triggerState);

  // eslint-disable-next-line no-unused-vars
  const [migrationItems, setMigrationItems] =
    useRecoilState(migrationItemsState);
  // eslint-disable-next-line no-unused-vars
  const currentEnvironment = useRecoilValue(currentEnvironmentState);

  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTragetEnvironment(event.target.value);
  };

  const createOrUpdateMigrationItems = async () => {
    if (!targetEnvironment) {
      return;
    }

    const environment = await getEnvironement(targetEnvironment);
    // eslint-disable-next-line no-restricted-syntax
    for (const contentType of migrationItems) {
      let contentTypeInEnv = null;

      try {
        contentTypeInEnv = await environment.getContentType(contentType.sys.id);
      } catch (error) {
        console.warn(error);
      }

      if (contentTypeInEnv) {
        await updateContentType(contentTypeInEnv, contentType);
        return;
      }

      await createContentType(targetEnvironment, contentType);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const submitMigration = async () => {
    try {
      await createOrUpdateMigrationItems();
      setFetchTrigger(true);
    } catch (e: unknown) {
      const error = e as Error;
      console.error(error);
    }
  };

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <HStack marginTop="4" padding="5">
            <VStack width="50%">
              {migrationItems?.map((contentType) => (
                <Box
                  key={contentType.sys.id}
                  width="100%"
                  borderRadius="xl"
                  backgroundColor="white"
                  border={`1px solid ${theme.colors.gray[300]}`}
                  padding="4"
                >
                  <HStack>
                    <Card size="20" color={theme.colors.teal[300]} />
                    <Text
                      fontWeight="bold"
                      textTransform="uppercase"
                      fontSize="sm"
                    >
                      {contentType.name}
                    </Text>
                  </HStack>

                  <Divider marginTop="1" marginBottom="2" />
                  {contentType?.fields?.map((field) => (
                    <Text key={field.id} fontWeight="bold" fontSize="sm">
                      {field.name}
                    </Text>
                  ))}
                </Box>
              ))}
            </VStack>
            <Flex alignItems="center" paddingLeft="4">
              <ArrowSwapHorizontal size="32" color={theme.colors.teal[300]} />

              <HStack marginLeft="4">
                <Flex
                  backgroundColor="white"
                  padding="4px"
                  width="30px"
                  height="30px"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="lg"
                >
                  <Hierarchy2 size="24" color={theme.colors.teal[300]} />
                </Flex>
                <Select size="md" onChange={(event) => handleOnChange(event)}>
                  {allEnvironments?.map((environment) => (
                    <option key={environment.name} value={environment.name}>
                      {environment.name}
                    </option>
                  ))}
                </Select>
              </HStack>
            </Flex>
          </HStack>
        </ModalBody>

        <ModalFooter>
          <Button
            w="100%"
            colorScheme="teal"
            size="lg"
            onClick={() => submitMigration()}
          >
            Start migration
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
