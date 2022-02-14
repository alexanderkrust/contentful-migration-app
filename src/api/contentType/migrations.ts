/* eslint-disable no-param-reassign */
import { ContentType } from 'contentful-management';
import { client } from '../..';

const Status = {
  UPDATED: 'updated',
  CREATED: 'created',
};

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

// Update ContentType
/**
 *
 * @param contentType
 */
export const updateContentType = async (
  contentTypeInEnvironment: ContentType,
  incomingContentTypeData: ContentType
) => {
  /* const merged = merge(contentTypeInEnvironment, incomingContentTypeData); */
  // eslint-disable-next-line no-restricted-syntax
  for (const field of incomingContentTypeData.fields) {
    let fieldInCType = contentTypeInEnvironment.fields.find(
      (fieldInContentType) => fieldInContentType.id === field.id
    );

    if (fieldInCType) {
      fieldInCType = field;
      contentTypeInEnvironment.update();
      break;
    }

    contentTypeInEnvironment.fields.push(field);
    contentTypeInEnvironment.update();
  }

  contentTypeInEnvironment.name = incomingContentTypeData.name;
  contentTypeInEnvironment.description = incomingContentTypeData.description;
  contentTypeInEnvironment.displayField = incomingContentTypeData.displayField;
  contentTypeInEnvironment.update();

  return true;
};

/**
 *
 * @param targetEnvironment
 * @param contentType
 * @returns
 */
export const createOrUpdateContentType = async (
  targetEnvironment: string,
  incomingContentTypeData: ContentType
) => {
  // if contentType exists, update it
  let contentTypeInEnvironment = null;

  try {
    contentTypeInEnvironment = await getContentTypeInEnvironment(
      targetEnvironment,
      incomingContentTypeData
    );
  } catch (error) {
    console.warn(error);
  }

  if (contentTypeInEnvironment) {
    await updateContentType(contentTypeInEnvironment, incomingContentTypeData);

    return {
      status: Status.UPDATED,
    };
  }

  await createContentType(targetEnvironment, incomingContentTypeData);

  return {
    status: Status.CREATED,
  };
};

// Does anything differs in ContentType between targetEnv and current env

// Create Field/s

// Update Field/s
