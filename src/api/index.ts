import { Environment, ContentType, Space } from 'contentful-management';
import { client } from '..';

export interface ContentfulEnvironmentWithContentTypes {
  contentTypes: ContentType[];
  environment: Environment;
}

export interface SpaceData {
  environmentsWithContentTypes: ContentfulEnvironmentWithContentTypes[];
  space: Space;
}

export const getSpaceData = async (): Promise<SpaceData> => {
  const space = await client.getSpace(
    process.env.REACT_APP_CONTENTFUL_SPACE_ID as string
  );

  let environments = await space.getEnvironments();
  // Filter Aliase
  environments = {
    ...environments,
    items: environments.items.filter((entry) => !!entry.sys.aliases),
  };

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
