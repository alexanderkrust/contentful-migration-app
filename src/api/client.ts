// import createClient directly
import * as contentful from 'contentful-management';

export const getClient = () => {
  const client = contentful.createClient({
    accessToken: process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN as string,
  });
  return client;
};
