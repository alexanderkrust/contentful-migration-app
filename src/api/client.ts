// import createClient directly
import * as contentful from 'contentful-management';

export const getClient = () => {
  if (
    !process.env.REACT_APP_CONTENTFUL_SPACE_ID ||
    !process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN
  ) {
    throw new Error(
      'Please provide a valid spaceId and your contentful management token.'
    );
  }

  const client = contentful.createClient({
    accessToken: process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN as string,
  });
  return client;
};
