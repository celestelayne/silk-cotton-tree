import {
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  TextureLoader,
  MathUtils,
  type Camera,
} from 'three'
import stormUrl from '../../assets/storm-over-atlantic-01.png'
import {
  CAMERA_PITCH,
  FOV,
  IMAGE_ASPECT,
  IMAGE_HORIZON_V,
  SKY_DISTANCE,
  SKY_OVERSCAN,
} from './config'

// Compute a plane size (at SKY_DISTANCE from the camera) large enough that the
// pitched camera frustum sees only image pixels — no gaps at the edges.
// - t: half-FOV tangent; used to project frustum extents at a given depth.
// - scale: distance from camera to the tilted plane along the view ray.
// - heightAboveHorizon: how tall the plane must be above the image horizon
//   to still fill the top of the frame after the camera pitch.
// - widthToFillHeight: the width implied by that height, honoring image aspect.
// - width: the larger of the two constraints (frustum width vs. aspect-driven),
//   scaled by SKY_OVERSCAN so the plane edges stay off-screen.
function skySize(aspect: number) {
  const t = Math.tan(MathUtils.degToRad(FOV / 2))
  const p = CAMERA_PITCH
  const scale = SKY_DISTANCE / (Math.cos(p) - t * Math.sin(p))
  const heightAboveHorizon = (t * Math.cos(p) + Math.sin(p)) * scale
  const widthToFillHeight = (heightAboveHorizon / (1 - IMAGE_HORIZON_V)) * IMAGE_ASPECT
  const width = Math.max(2 * aspect * t * scale, widthToFillHeight) * SKY_OVERSCAN
  return { width, height: width / IMAGE_ASPECT }
}

export function createSky() {
  // Load the storm backdrop; sRGB so it displays with the source's colors.
  const texture = new TextureLoader().load(stormUrl)
  texture.colorSpace = SRGBColorSpace

  // Backdrop material: no fog (it IS the fog color at the horizon), and
  // no depth interaction so it always draws behind everything else.
  const material = new MeshBasicMaterial({
    map: texture,
    fog: false,
    depthTest: false,
    depthWrite: false,
  })
  // Placeholder 1x1 plane; resize() replaces the geometry with correct dimensions.
  // renderOrder = -1 ensures the sky renders before the ocean.
  const mesh = new Mesh(new PlaneGeometry(1, 1), material)
  mesh.renderOrder = -1

  // Vertical offset applied in update() so the image's horizon lines up with y=0.
  let lift = 0

  // Rebuild the plane whenever the viewport aspect changes, and recompute lift.
  function resize(aspect: number) {
    const { width, height } = skySize(aspect)
    mesh.geometry.dispose()
    mesh.geometry = new PlaneGeometry(width, height)
    lift = (0.5 - IMAGE_HORIZON_V) * height
  }

  // Keep the sky pinned in front of the camera at a fixed distance, so it
  // behaves like a distant backdrop rather than a nearby wall.
  function update(camera: Camera) {
    mesh.position.set(
      camera.position.x,
      camera.position.y + lift,
      camera.position.z - SKY_DISTANCE,
    )
  }

  return { mesh, resize, update }
}
