# silk cotton tree

A small 3D scene: a stormy Atlantic sky wrapped on a partial cylinder around the viewer, a reflective ocean, a horizon mist band, and a drag-to-look camera clamped to a narrow window with input-lag smoothing. Built with vanilla [three.js](https://threejs.org/), [Vite](https://vite.dev/), and TypeScript.

## Getting started

```sh
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Drag to look around — the camera is clamped and drifts back to forward when idle.

## Scripts

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR        |
| `npm run build`   | Type-check and build to `dist/`           |
| `npm run preview` | Serve the production build locally        |
| `npm run lint`    | Run Oxlint over the source                |

## Project structure

```
silk-cotton-tree/
├── index.html
├── assets/                   # Imported through Vite for hashed URLs
│   ├── storm-over-atlantic-01.png
│   └── waternormals.jpg
├── .github/workflows/
│   └── deploy.yml            # Builds and pushes dist/ to gh-pages on push to main
└── src/
    ├── main.ts               # Renderer, scene, camera, drag-to-look rig, animation loop
    ├── styles.css            # Full-viewport canvas styles
    └── scene/
        ├── config.ts         # All tunables — camera, sky arc, mist, water, look controls
        ├── Sky.ts            # Inward-facing cylinder-segment backdrop
        ├── Ocean.ts          # Reflective water via three/addons Water
        └── HorizonMist.ts    # Shader-driven ring that fades above and below eye level
```

Each scene layer is a factory function returning `{ mesh, update }` (and sometimes `resize`). `main.ts` calls `update(camera)` on each per frame — the layers keep themselves centered on the camera so the backdrop stays wrapped around the viewer.

## Scene layers

- **Sky** (`Sky.ts`) — a partial cylinder of `SKY_ARC` radians at radius `SKY_DISTANCE`, textured with a storm photo and rendered from the inside (`BackSide`). Height derives from arc length via image aspect so the picture isn't stretched.
- **Ocean** (`Ocean.ts`) — three's `Water` class from `three/addons`. Planar reflection captures the sky cylinder and mist band; the sun highlight is disabled to hold the overcast mood.
- **Horizon mist** (`HorizonMist.ts`) — a ring cylinder centered on eye level with a custom shader that fades above and below the horizon, softening the seam where sky meets water.
- **Drag-to-look** (`main.ts`) — OrbitControls drives a hidden dummy camera with `min/maxAzimuthAngle` and `min/maxPolarAngle` clamps; the real camera slerps its quaternion toward the dummy each frame for lag, and the dummy's position eases back to its start when idle.

## Tuning

All of the knobs — camera height, sky arc, mist opacity and spread, water color and distortion, look yaw/pitch limits, return speed, lag alpha — live in [`src/scene/config.ts`](src/scene/config.ts). Edit a value, save, and Vite HMR reloads.

## Stack

- Vite + TypeScript
- three, including the `Water` and `OrbitControls` addons from `three/examples/jsm`

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: builds with `npm run build` and pushes `dist/` to the `gh-pages` branch. `vite.config.ts` sets `base: './'` so built asset paths resolve under the repo subpath on GitHub Pages.
