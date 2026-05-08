# Car QR Sales Site

A simple website for selling your own cars with unique QR pages.

## Features

- Public list of cars
- Individual car page
- Admin page to add cars
- Supabase database
- QR code for each car page
- Works with GitHub Pages

## Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor and run `supabase_schema.sql`.
3. Copy `.env.example` to `.env`.
4. Add your Supabase URL and anon key.
5. Run:

```bash
npm install
npm run dev
```

## Admin page

Open:

```txt
/admin
```

For the first version there is no login yet. Do not share the admin link publicly.

## Deploy to GitHub Pages

1. Push this project to GitHub.
2. In `vite.config.js`, change `base` to your repository name:

```js
base: "/your-repo-name/"
```

3. Run:

```bash
npm run build
npm run deploy
```
