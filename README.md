# memes.skyra.pw

This is a private dynamic meme generator designed primarily for updating [Artiel](https://github.com/skyra-project/artiel)'s meme template file.

## Setup

To run the database locally, you need to use and configure Wrangler:

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
yarn wrangler d1 execute memes-skyra-pw --local --file server/db/schema.sql
```
