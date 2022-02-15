import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect } from 'react';
import { getSpaceData } from '../../api';
import { spaceState, triggerState } from '../space';
import { mainBranchState } from '../settings';

export function ContentfulSpace() {
  // eslint-disable-next-line no-unused-vars
  const [spaceData, setSpaceData] = useRecoilState(spaceState);
  const [trigger, setTrigger] = useRecoilState(triggerState);

  const mainBranch = useRecoilValue(mainBranchState);

  useEffect(() => {
    const fetchSpaceData = async () => {
      const response = await getSpaceData();
      setSpaceData(response);
    };

    if (!spaceData) {
      fetchSpaceData();
    }

    if (trigger) {
      fetchSpaceData();
      setTrigger(false);
    }
  }, [trigger, spaceData]);

  useEffect(() => {
    if (!spaceData) {
      return;
    }

    if (spaceData?.environmentsWithContentTypes?.length <= 1) {
      return;
    }

    // If the first item of the environments already is the mainBranch, just leave it
    if (
      spaceData?.environmentsWithContentTypes[0].environment.sys.id ===
      mainBranch?.environment.sys.id
    ) {
      return;
    }

    const copy = { ...spaceData };
    const mainEnv = copy.environmentsWithContentTypes?.find(
      (env) => env?.environment?.sys?.id === mainBranch?.environment.sys.id
    );

    if (!mainEnv) {
      return;
    }
    const mainEnvCopy = { ...mainEnv };

    const filtered = copy.environmentsWithContentTypes.filter(
      (env) => env.environment.sys.id !== mainEnv.environment.sys.id
    );

    copy.environmentsWithContentTypes = [mainEnvCopy, ...filtered];
    setSpaceData(copy);
  }, [mainBranch]);

  return null;
}
