import {
  BackSide,
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  type Camera,
} from 'three'
import stormUrl from '../../assets/storm-over-atlantic-01.png'
import {
  IMAGE_ASPECT,
  IMAGE_HORIZON_V,
  SKY_ARC,
  SKY_DISTANCE,
} from './config'

export function createSky() {
  // Load the storm backdrop; sRGB so it displays with the source's colors.
  const texture = new TextureLoader().load(stormUrl)
  texture.colorSpace = SRGBColorSpace
  // Flip U so the image reads correctly when the inside of the cylinder is
  // rendered — BackSide inverts the apparent UV orientation.
  texture.wrapS = RepeatWrapping
  texture.repeat.x = -1
  texture.offset.x = 1

  // Backdrop material: BackSide so the cylinder is visible from inside,
  // no fog, and no depth interaction so it always sits behind everything.
  const material = new MeshBasicMaterial({
    map: texture,
    side: BackSide,
    fog: false,
    depthTest: false,
    depthWrite: false,
  })

  // Partial cylinder wrapping the viewer. Height is derived from the arc
  // length via the source image aspect, so nothing gets stretched.
  const radius = SKY_DISTANCE
  const height = (radius * SKY_ARC) / IMAGE_ASPECT
  // Center the arc on the -Z direction (where the camera looks).
  // three.js CylinderGeometry places theta=0 at +Z, so -Z sits at theta=π.
  const thetaStart = Math.PI - SKY_ARC / 2
  const geometry = new CylinderGeometry(
    radius,
    radius,
    height,
    64,
    1,
    true, // openEnded — no top/bottom caps
    thetaStart,
    SKY_ARC,
  )

  const mesh = new Mesh(geometry, material)
  mesh.renderOrder = -1

  // Shift the cylinder vertically so the image horizon row lines up with the
  // camera's eye level (where the ocean's horizon appears visually).
  const lift = (0.5 - IMAGE_HORIZON_V) * height

  // Arc is fixed in radians, so screen aspect no longer affects the geometry.
  // Kept as a no-op stub so main.ts's call site doesn't need to change.
  function resize(_aspect: number) {}

  function update(camera: Camera) {
    mesh.position.set(
      camera.position.x,
      camera.position.y + lift,
      camera.position.z,
    )
  }

  return { mesh, resize, update }
}
