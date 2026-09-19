# Virtual Health Precinct

Minimal Next.js, React and TypeScript application using the App Router and npm.
The home page is a placeholder for the clinical simulation prototype.

## Local development

Use Node.js 20.9 or later and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Edit `app/page.tsx` to update the home page.
The shared layout is in `app/layout.tsx`, with basic styles in `app/globals.css`.

## Checks and production

```sh
npm run lint
npm run build
npm start
```

No environment variables or external services are required for this placeholder.
Local environment files are ignored by Git.

Project requirements and planning documents are in `docs/`.
