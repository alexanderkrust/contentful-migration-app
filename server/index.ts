import Migration from 'contentful-migration';
import express = require('express');

const cors = require('cors');

require('dotenv').config();

const runMigration = require('contentful-migration/built/bin/cli').default;

const PORT = 3001;

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// eslint-disable-next-line no-unused-vars

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

app.post('/migrate', async (req, res) => {
  const migrationItems = req.body.items;
  const { targetEnvironment } = req.body;

  const options = {
    migrationFunction: (migration: Migration) => {
      migrationItems.forEach((contentType: any) => {
        const newType = migration
          .createContentType(contentType.name)
          .name(contentType.name);

        contentType.fields.forEach((field: any) => {
          newType
            .createField(field.name)
            .name(field.name)
            .type(field.type)
            .required(field.required);
        });
      });
    },
    spaceId: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    accessToken: process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN,
    environmentId: targetEnvironment,
  };

  runMigration(options)
    .then((result: any) => {
      res.send({
        result,
      });
    })
    .catch((error: any) => console.log('Error: ', error));
  /* try {
    const spaceMigration = await runMigration(options);
    res.send({
      spaceMigration,
    });
  } catch (e: unknown) {
    const error = e as Error;
    console.info('CATCH');
    res.send({
      error: error.message,
    });
  } */
});
