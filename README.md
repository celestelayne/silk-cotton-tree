# silk cotton tree

A basic 3D scene built with [React Three Fiber](https://r3f.docs.pmnd.rs/) — an orange cube, some lighting, and orbit controls. Scaffolded with Vite + React + TypeScript as a starting point for exploring three.js in a React idiom.

## Getting started

```sh
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). You should see an orange cube on a dark background. Drag to orbit, scroll to zoom.

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
├── assets/                # Static assets outside the bundle
└── src/
    ├── main.tsx           # React root
    ├── App.tsx            # <Canvas> — boundary between DOM and R3F
    ├── styles.css         # Full-viewport canvas styles
    └── scene/
        ├── Scene.tsx      # Lights + OrbitControls, composes the world
        └── Box.tsx        # Rotating cube (useFrame animates it)
```

The convention: **one component per mesh / light group / camera**, each in `src/scene/`. Every object owns its own `useFrame`, refs, and state — that's the R3F idiom.

## Stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [three](https://threejs.org/) — the underlying 3D library
- [@react-three/fiber](https://r3f.docs.pmnd.rs/) — React renderer for three.js
- [@react-three/drei](https://drei.docs.pmnd.rs/) — helpers (used here for `OrbitControls`)

## Growing from here

Add folders as you actually need them, not before:

- `hooks/` — once you have a reusable one (e.g. `useCursor`)
- `src/assets/` — when you import `.glb` models or textures through the bundler
- `shaders/` — for GLSL
- `store.ts` — for global state (zustand pairs well with R3F)
