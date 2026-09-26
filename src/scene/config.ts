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

// Sampled from the image: the far sea just below the horizon, and the near sea.
export const FOG_COLOR = '0xDFE9F3'
export const FOG_DENSITY = 0.015
export const OCEAN_COLOR = '#182221'
export const OCEAN_SIZE = 800
