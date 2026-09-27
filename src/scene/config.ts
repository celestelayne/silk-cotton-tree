import { MathUtils } from 'three'

export const CAMERA_HEIGHT = 1.5
export const FOV = 50

// The storm image is 1500x1000 with the horizon at row 763.
export const IMAGE_ASPECT = 1500 / 1000
const IMAGE_HORIZON_FROM_TOP = 763 / 1000
export const IMAGE_HORIZON_V = 1 - IMAGE_HORIZON_FROM_TOP

// Pitch the camera up so the horizon lands on screen where it sits in the image.
export const CAMERA_PITCH = Math.atan(
  (2 * IMAGE_HORIZON_FROM_TOP - 1) * Math.tan(MathUtils.degToRad(FOV / 2)),
)

export const SKY_DISTANCE = 200
// Extra sky beyond the visible frame, so edges stay hidden.
export const SKY_OVERSCAN = 1.1
// Horizontal arc the sky cylinder wraps around the viewer. Wider values curve
// more into peripheral vision; must exceed the camera's horizontal FOV plus
// margin, and be wide enough that image height (derived via aspect) covers
// the vertical FOV.
export const SKY_ARC = MathUtils.degToRad(150)

// Sampled from the image: the far sea just below the horizon, and the near sea.
export const FOG_COLOR = 0xDFE9F3

// Horizon mist band: a ring centered on the horizon that fades out above and below it.
export const MIST_COLOR = 0xc6cace
// Opacity at the horizon line (0–1).
export const MIST_OPACITY = 0.8
// How far the band reaches above and below the horizon, in degrees.
export const MIST_SPREAD_DEG = 6
// Fade shape: 1 is a soft even fade; higher values tighten the mist toward the horizon line.
export const MIST_FALLOFF = 1.5
// Just inside the sky cylinder, so the band sits in front of it.
export const MIST_RADIUS = 190

export const OCEAN_COLOR = '#182221'
export const OCEAN_SIZE = 800

// Water surface (three/addons Water). No sun highlight is enabled, so the
// tunables here shape ripple/reflection character.
// How much the reflection warps across the surface — higher = choppier.
export const WATER_DISTORTION = 6
// Normal-map tile size in world units. Smaller = larger apparent ripples.
export const WATER_SIZE = 2
// Reflection render-target resolution (square). Higher = sharper, slower.
export const WATER_TEXTURE_RES = 512
