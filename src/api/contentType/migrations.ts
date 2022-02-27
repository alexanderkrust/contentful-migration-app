/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
/* eslint-disable no-param-reassign */
import { ContentFields, ContentType, KeyValueMap } from 'contentful-management';
import { client } from '../..';

/**
 * Not using Promise.all() for some cases, because getting the content type of a specific environment
 * gave false data inside the Promise resolving but it was getting the right data from the request.
 * Strange behavior, so most of this stuff now getting solved by array.reduce()
 */

// TODO: when on the new branch are more fields than in the main branch, add them
// TODO: when on the new branch are less fields than in the main branch, remove them
// TODO: if there are multiple migration items, check if there are relations between them, and if so, add them first
// TODO: before that point above, check if this is necessary

/* const FieldTypes = {
  Link: 'Link',
};

const LinkTypes = {
  Entry: 'Entry',
}; */

export const getEnvironement = async (environmentId: string) => {
  const space = await client.getSpace(
    process.env.REACT_APP_CONTENTFUL_SPACE_ID as string
  );

  const environment = await space.getEnvironment(environmentId);
  return environment;
};

// Does ContentType exists
/**
 *
 * @param targetEnvironment
 * @param contentType
 * @returns
 */
export const getContentTypeInEnvironment = async (
  targetEnvironment: string,
  // eslint-disable-next-line no-unused-vars
  contentType: ContentType
) => {
  const environment = await getEnvironement(targetEnvironment);
  return environment?.getContentType(contentType.sys.id);
};

// Create ContentType
/**
 *
 * @param targetEnvironment
 * @param contentType
 */
export const createContentType = async (
  targetEnvironment: string,
  contentType: ContentType
) => {
  let data = null;
  const environment = await getEnvironement(targetEnvironment);

  const { displayField } = contentType;

  // check if displayField exists in fields array
  const displayFieldExists = contentType.fields.some(
    (field) => field.id === displayField
  );

  if (displayFieldExists) {
    data = contentType;
  } else {
    data = {
      ...contentType,
      displayField: contentType.fields[0].id,
    };
  }

  const createdContentType = await environment.createContentTypeWithId(
    contentType.sys.id,
    data
  );
  return createdContentType;
};

const filterFields = (
  targetFields: ContentFields<KeyValueMap>[],
  comparedFields: ContentFields<KeyValueMap>[]
) =>
  targetFields?.filter((fieldInEnv) => {
    const index = comparedFields.findIndex(
      (field) => fieldInEnv.id === field.id
    );
    return index === -1;
  });

/* const isRelationField = (field: ContentFields<KeyValueMap>) =>
  field.type !== FieldTypes.Link && field.linkType !== LinkTypes.Entry; */

const getRelationsInField = (field: ContentFields<KeyValueMap>) => {
  if (!field.validations) {
    return;
  }

  // One to One Relation
  if (field.validations?.length > 0) {
    return field.validations?.map((validation) => validation.linkContentType);
  }

  // One to Many Relation
  return field.items?.validations?.map(
    (validation) => validation.linkContentType
  );
};

const getRelationsInContentType = (contentType: ContentType) =>
  contentType.fields.map((field) => getRelationsInField(field)?.flat(2) ?? []);

const getRelatedContentTypeInMigrationItems = (
  migrationItems: ContentType[],
  contentTypeId: string
) =>
  migrationItems.find(
    (migrationItem) => migrationItem.sys.id === contentTypeId
  );
/* const handleRelations = (field: ContentFields<KeyValueMap>) => {
  // does related contentType exist in the environment?
  // if not, create it
}; */

/**
 *
 * @param contentType
 */
export const updateContentType = async (
  contentTypeInEnvironment: ContentType,
  incomingContentTypeData: ContentType
) => {
  // Collect deleted fields
  const deletedFields = filterFields(
    contentTypeInEnvironment?.fields,
    incomingContentTypeData?.fields
  );

  console.log('deleted fields: ', deletedFields);

  // Collect new fields
  const newFields = filterFields(
    incomingContentTypeData?.fields,
    contentTypeInEnvironment?.fields
  );

  // Check if field is of type Link and linkType "Entry" -> referenceto other contentType (careful validation is an array, linkContentType as well)
  // if linked contentType does not exist in main branch -> create it first
  console.log('new fields: ', newFields);

  await newFields.reduce(async (promise, field) => {
    // This line will wait for the last async function to finish.
    // The first iteration uses an already resolved Promise
    // so, it will immediately continue.
    await promise;
    /* if (checkForRelations(field)) {
      // handleRelations(newField);
    } */

    console.log(field);
  }, Promise.resolve());

  return;

  // eslint-disable-next-line no-restricted-syntax
  for (const field of incomingContentTypeData.fields) {
    let fieldInCType = contentTypeInEnvironment.fields.find(
      (fieldInContentType) => fieldInContentType.id === field.id
    );

    if (fieldInCType) {
      fieldInCType = field;
      // contentTypeInEnvironment.update();
      break;
    }

    contentTypeInEnvironment.fields.push(field);
    // contentTypeInEnvironment.update();
  }

  contentTypeInEnvironment.name = incomingContentTypeData.name;
  contentTypeInEnvironment.description = incomingContentTypeData.description;
  contentTypeInEnvironment.displayField = incomingContentTypeData.displayField;
  // contentTypeInEnvironment.update();

  /* return true; */
};

/**
 *
 * @param targetEnvironment
 * @param contentType
 * @returns
 */
export const createOrUpdateContentTypes = async (
  targetEnvironmentId: string,
  migrationItems: ContentType[]
) => {
  // if contentType exists, update it
  const environment = await getEnvironement(targetEnvironmentId);

  // Sort migrationItems by relationship

  return;

  // eslint-disable-next-line no-restricted-syntax
  for (const contentType of migrationItems) {
    let contentTypeInEnv = null;

    try {
      // eslint-disable-next-line no-await-in-loop
      contentTypeInEnv = await environment.getContentType(contentType.sys.id);
    } catch (error) {
      console.warn(error);
    }

    console.log('contentType.sys.id', contentTypeInEnv);

    if (contentTypeInEnv) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await updateContentType(contentTypeInEnv, contentType);
        break;
      } catch (error) {
        console.warn(error);
      }
    }

    try {
      // eslint-disable-next-line no-await-in-loop
      await createContentType(environment.sys.id, contentType);
    } catch (error) {
      console.warn(error);
    }
  }

  return true;
};

// Does anything differs in ContentType between targetEnv and current env
export const analyseMigration = async (
  targetEnvironmentId: string,
  migrationItems: ContentType[]
) => {
  const environment = await getEnvironement(targetEnvironmentId);

  const relatedContentTypes = migrationItems
    .map((contentType) => {
      const relations = getRelationsInContentType(contentType);

      return relations;
    })
    .flat(2);

  const notExistingCTypesInMainBranch: string[] = [];
  await relatedContentTypes.reduce(async (promise, contentTypeId) => {
    await promise;
    try {
      await environment?.getContentType(contentTypeId!);
    } catch (error) {
      console.warn(error);
      notExistingCTypesInMainBranch.push(contentTypeId!);
    }
  }, Promise.resolve());

  console.log(relatedContentTypes);
  return notExistingCTypesInMainBranch;
};
