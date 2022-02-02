import { Environment, ContentType, Space } from 'contentful-management';
import { getClient } from './client';

export interface ContentfulEnvironmentWithContentTypes {
  contentTypes: ContentType[];
  environment: Environment;
}

export interface SpaceData {
  environmentsWithContentTypes: ContentfulEnvironmentWithContentTypes[];
  space: Space;
}

export const getSpaceData = async (): Promise<SpaceData> => {
  const space = await getClient().getSpace(
    process.env.REACT_APP_CONTENTFUL_SPACE_ID as string
  );

  const environments = await space.getEnvironments();

  const environmentsWithContentTypes: ContentfulEnvironmentWithContentTypes[] =
    await Promise.all(
      environments.items.map(async (environment) => {
        const contentTypes = await environment.getContentTypes();

        return {
          environment,
          contentTypes: contentTypes.items,
        };
      })
    );

  return {
    space,
    environmentsWithContentTypes,
  };
};
