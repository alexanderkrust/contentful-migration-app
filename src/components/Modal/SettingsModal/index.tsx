/* eslint-disable no-await-in-loop */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  Box,
  Text,
  Select,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { settingsState } from '../../../state/settings';
import { allEnvironmentState } from '../../../state/space';
import { setSettingsInStorage } from '../../../storage/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingTypes = {
  MAIN_BRANCH: 'mainBranch',
};

type ValueOf<T> = T[keyof T];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const toast = useToast();

  const allEnvironments = useRecoilValue(allEnvironmentState);
  const [settings, setSettings] = useRecoilState(settingsState);

  // TODO: Set dropdown value to settings mainBranch from localstorage
  const handleOnChange = async (
    event: ChangeEvent<HTMLSelectElement>,
    settingType: ValueOf<typeof SettingTypes>
  ) => {
    setSettings({
      ...settings,
      [settingType]: event.target.value,
    });

    await setSettingsInStorage({
      ...settings,
      [settingType]: event.target.value,
    });

    let description = '';
    switch (settingType) {
      case SettingTypes.MAIN_BRANCH: {
        description = 'Successfully switched the main branch.';
        break;
      }
      default: {
        description = '';
      }
    }

    toast({
      title: 'Settings changed.',
      description,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalContent>
        <ModalHeader>
          <Heading as="h2" size="lg" isTruncated>
            Settings
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex marginTop="5" paddingRight="5">
            <Box width="50%">
              <Heading as="h3" size="sm" isTruncated>
                Main Branch
              </Heading>
              <Box marginTop="4" maxWidth="75%">
                <Text fontSize="xs">
                  The main branch inherits the content contentTypes of your
                  website. If you select another main branch, the other branches
                  are compared against the main branch. Thus one can determine
                  which ContentType are not synchronized with the main branch.
                </Text>
              </Box>
            </Box>
            <Flex alignItems="center" width="50%">
              <Select
                width="100%"
                marginTop="4"
                size="md"
                value={settings.mainBranch!}
                onChange={(event) =>
                  handleOnChange(event, SettingTypes.MAIN_BRANCH)
                }
              >
                {allEnvironments?.map((environment) => (
                  <option key={environment.name} value={environment.name}>
                    {environment.name}
                  </option>
                ))}
              </Select>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
