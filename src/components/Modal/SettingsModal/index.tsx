/* eslint-disable no-await-in-loop */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
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
        <ModalBody>Body</ModalBody>

        <ModalFooter>Footer</ModalFooter>
      </ModalContent>
    </Modal>
  );
}
