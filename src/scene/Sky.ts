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
  const texture = new TextureLoader().load(stormUrl)
  texture.colorSpace = SRGBColorSpace

  const material = new MeshBasicMaterial({
    map: texture,
    fog: false,
    depthTest: false,
    depthWrite: false,
  })
  const mesh = new Mesh(new PlaneGeometry(1, 1), material)
  mesh.renderOrder = -1

  let lift = 0

  function resize(aspect: number) {
    const { width, height } = skySize(aspect)
    mesh.geometry.dispose()
    mesh.geometry = new PlaneGeometry(width, height)
    lift = (0.5 - IMAGE_HORIZON_V) * height
  }

  function update(camera: Camera) {
    mesh.position.set(
      camera.position.x,
      camera.position.y + lift,
      camera.position.z - SKY_DISTANCE,
    )
  }

  return { mesh, resize, update }
}
