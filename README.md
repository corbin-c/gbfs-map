# gbfs-map

Interactive map for live shared micromobility (bikes and scooters) using [GBFS](https://gbfs.org/) feeds.

gbfs-map is a Lit-based web application that lets you search public GBFS systems around the world, select the ones you want to monitor, and view available vehicles in real time on a MapLibre GL basemap. Each selected feed is shown in a distinct color so you can tell networks apart at a glance.

## Features

- **Search GBFS systems** — Live-filter the global [GBFS systems registry](https://github.com/MobilityData/gbfs/blob/master/systems.csv) by name, location, country, or system ID.
- **Select multiple feeds** — Check any number of systems; the map pulls their `free_bike_status` data automatically.
- **Color-coded vehicles** — Every feed gets its own color from a rotating 15-color palette, hashed by feed URL for consistency.
- **Auto-fitted map bounds** — The map zooms and pans to fit the vehicles from your selected feeds.
- **MapLibre GL basemap** — Clean, fast vector tiles via [OpenFreeMap](https://openfreemap.org/).

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (recommended)
- [npm](https://www.npmjs.com/) 10+

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm start
```

The dev server will compile TypeScript, watch for changes, and reload the browser automatically.

To serve the production build locally:

```bash
npm run build
npm run start:build
```

## Available scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the dev server with TypeScript watch and live reload. |
| `npm run start:build` | Serve the built `dist/` directory. |
| `npm run build` | Clean, compile TypeScript, bundle with Rollup, and generate the custom elements manifest. |
| `npm test` | Compile and run the Web Test Runner suite with coverage. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run lint` | Check TypeScript and HTML with ESLint and Prettier. |
| `npm run format` | Auto-fix ESLint issues and format code with Prettier. |

## How it works / Data sources

- **GBFS systems list** — On load, the app fetches the latest `systems.csv` from the [MobilityData GBFS repository](https://raw.githubusercontent.com/MobilityData/gbfs/refs/heads/master/systems.csv).
- **CORS proxy** — All external requests go through a CORS proxy (`https://cors-proxy-sha-6d19c78.onrender.com/api/proxy?url=`) so the browser can reach GBFS endpoints that do not serve cross-origin headers. A commented-out localhost alternative is available in `src/cors-proxy.ts` for local development.
- **Feed discovery** — When you check a system, the app retrieves its `gbfs.json` auto-discovery file, finds the `free_bike_status` feed URL, and fetches the current vehicle list.
- **State sharing** — Available bikes are stored in a Lit context (`bikesContext`) and consumed by the map component, which renders them as GeoJSON circle layers.

## Deployment

The app is deployed to **GitHub Pages** via the GitHub Actions workflow in `.github/workflows/deploy.yml`.

Live site: [https://corbin-c.github.io/gbfs-map/](https://corbin-c.github.io/gbfs-map/)

> **One-time setup:** In your repository settings, set the Pages **Source** to **GitHub Actions** so the workflow can publish the site.

## License

[MIT](LICENSE)
