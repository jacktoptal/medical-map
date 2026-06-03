# medmaps

Mapping project to create an interactive geo-visualization dashboard for companies to display doctor coverage of each service type.

**Live demo:** [https://medical-map-mu.vercel.app/](https://medical-map-mu.vercel.app/)

## Stack

React 19, Vite 6, Tailwind CSS 4, MUI 9, deck.gl 9, react-map-gl, Mapbox GL.

## Prerequisites

- Node.js 20+ recommended
- A [Mapbox access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/) and style URL

## Install

```bash
npm install
```

Copy [`.env.example`](.env.example) to **`.env`** and set **`VITE_MAPBOX_ACCESS_TOKEN`** and **`VITE_MAPBOX_STYLE`**. The dev server must be restarted after changing env files.

## Scripts

| Command | Description |
| -------- | ----------- |
| `npm start` / `npm run start-local` | Dev server with hot reload and browser open ([http://localhost:9001](http://localhost:9001)) |
| `npm run dev` | Same port, without `--open` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Environment variables

Vite only exposes variables whose names start with **`VITE_`**. They are read at **build time** and replaced in the bundle (see [`src/mapbox-env.js`](src/mapbox-env.js)).

| Variable | Required | Description |
| -------- | -------- | ----------- |
| **`VITE_MAPBOX_ACCESS_TOKEN`** | Yes (for map) | Mapbox public token |
| **`VITE_MAPBOX_STYLE`** | Yes (for map) | Mapbox style URL (e.g. `mapbox://styles/...`) |
| **`VITE_BASE_PATH`** | Optional | URL prefix if you host under a subpath. Leave unset for root hosting (Vercel default). |

**Local development:** use **`.env`** or **`.env.local`** (both gitignored).

**Local production build:** use **`.env.production.local`** (gitignored) for Mapbox values so tokens are never committed.

**CI (e.g. GitHub Actions):** set **`VITE_MAPBOX_ACCESS_TOKEN`** and **`VITE_MAPBOX_STYLE`** as repository secrets and pass them into the `npm run build` step as environment variables.

## Deploy (Vercel)

1. Connect the repository in Vercel.
2. Add env vars in Vercel Project Settings:
   - `VITE_MAPBOX_ACCESS_TOKEN`
   - `VITE_MAPBOX_STYLE`
3. Build command: `npm run build`
4. Output directory: `dist`

No custom base path is needed for root hosting on Vercel.

## License

MIT
