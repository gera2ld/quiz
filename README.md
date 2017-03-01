Quiz
---

A quiz platform to discover your intelligence.

Development
---

Create `config.yml` and add required keys.

``` sh
# Start server with nodemon
$ npm run dev
```

API document is available at `/api/_docs/`.

1. For MySQL, remember to set the database charset to `utf-8` first.

   ``` sh
   $ mysql -u root -p
   ```

   ``` sql
   > CREATE DATABASE quiz DEFAULT CHARACTER SET utf8mb4 COLLATE utf8_unicode_ci;
   -- or alter database charset later
   > ALTER DATABASE quiz CHARACTER SET utf8mb4 COLLATE utf8_unicode_ci;
   ```

1. Then migrate data.

   ``` sh
   $ ./node_modules/.bin/sequelize db:migrate
   ```
