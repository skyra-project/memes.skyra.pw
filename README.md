# memes.skyra.pw

This is a private dynamic meme generator designed primarily for updating [Artiel](https://github.com/skyra-project/artiel)'s meme template file.

## Setup

If you want to run the database locally (i.e. for making database changes), you need to use and configure Wrangler. If you do not need to make database related changes, you can rely on the production database.

```toml
# wrangler.toml
name = "memes-skyra-pw"
main = "./.output/server/index.mjs"
compatibility_date = "2023-05-18"

[[d1_databases]]
binding = "DATABASE"
database_name = "memes-skyra-pw"
database_id = "<Your-Database-ID>"
```

Followed by this command:

```bash
yarn wrangler:create
```

And then you can build the website using `yarn build` and run it with:

```bash
yarn wrangler:dev
```
