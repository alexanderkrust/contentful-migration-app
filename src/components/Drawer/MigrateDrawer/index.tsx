/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { migrationItemsState } from '../../../state/migrate';

import {
  createOrUpdateContentTypes,
  analyseMigration,
} from '../../../api/contentType/migrations';
import { mainBranchState } from '../../../state/settings';
import { triggerState } from '../../../state/space';
import type { ValueOf } from '../../../types';

interface MigrateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalysingState = {
  IDLE: 'IDLE',
  ANALYSING: 'ANALYSING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

interface Analysis {
  state: ValueOf<typeof AnalysingState>;
  data: string[] | null;
}

export function MigrateDrawer({ isOpen, onClose }: MigrateDrawerProps) {
  // eslint-disable-next-line no-unused-vars
  const [fetchTrigger, setFetchTrigger] = useRecoilState(triggerState);
  const mainBranch = useRecoilValue(mainBranchState);

  const [analysis, setAnalysis] = useState<Analysis>({
    state: AnalysingState.IDLE,
    data: null,
  });

  // eslint-disable-next-line no-unused-vars
  const [migrationItems, setMigrationItems] =
    useRecoilState(migrationItemsState);

  useEffect(() => {
    if (!isOpen) return;
    if (!mainBranch && !migrationItems.length) return;

    async function startAnalysis() {
      setAnalysis({
        ...analysis,
        state: AnalysingState.ANALYSING,
      });

      let data = null;
      try {
        data = await analyseMigration(
          mainBranch?.environment.sys.id as string,
          migrationItems
        );
      } catch (error) {
        console.warn(error);
      }

      setAnalysis({
        state: AnalysingState.SUCCESS,
        data,
      });
    }

    startAnalysis();
  }, [mainBranch, migrationItems, isOpen]);

  // eslint-disable-next-line no-unused-vars
  const submitMigration = async () => {
    if (!mainBranch) {
      // TODO: User feedback
      // or better mainBranch should not be undefined
      return;
    }
    try {
      return;
      await createOrUpdateContentTypes(
        mainBranch!.environment.sys.id,
        migrationItems
      );
      setFetchTrigger(true);
    } catch (e: unknown) {
      const error = e as Error;
      console.error(error);
    }
  };

  return (
    <Drawer size="xl" isOpen={isOpen} onClose={onClose} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader />
        <DrawerCloseButton />
        <DrawerBody>
          {analysis.state !== AnalysingState.SUCCESS && (
            <Flex height="100%">
              <Spinner size="xl" margin="auto auto" />
            </Flex>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button
            w="100%"
            colorScheme="teal"
            size="lg"
            disabled={analysis.state !== AnalysingState.SUCCESS}
            onClick={() => submitMigration()}
          >
            Start migration
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
