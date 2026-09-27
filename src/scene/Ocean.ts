import {
  PlaneGeometry,
  RepeatWrapping,
  TextureLoader,
  Timer,
  Vector3,
  type Camera,
} from 'three'
import { Water } from 'three/addons/objects/Water.js'
import waterNormalsUrl from '../../assets/waternormals.jpg'
import {
  OCEAN_COLOR,
  OCEAN_SIZE,
  WATER_DISTORTION,
  WATER_SIZE,
  WATER_TEXTURE_RES,
} from './config'

export function createOcean() {
  const waterNormals = new TextureLoader().load(waterNormalsUrl)
  waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping

  const water = new Water(new PlaneGeometry(OCEAN_SIZE, OCEAN_SIZE), {
    waterNormals,
    // Black sun kills the specular highlight; the storm sky is overcast.
    sunColor: 0x000000,
    // Direction still needs to be non-zero for the shader's normalize().
    sunDirection: new Vector3(0, 1, 0),
    waterColor: OCEAN_COLOR,
    distortionScale: WATER_DISTORTION,
    textureWidth: WATER_TEXTURE_RES,
    textureHeight: WATER_TEXTURE_RES,
    fog: false,
  })
  // PlaneGeometry is created in the XY plane; rotate it flat onto the ground.
  water.rotation.x = -Math.PI / 2

  // `size` exists in the shader uniforms but isn't in @types/three's WaterOptions,
  // so set it directly on the material.
  const uniforms = water.material.uniforms
  uniforms['size'].value = WATER_SIZE
  // Timer pauses via the Page Visibility API so hiding the tab doesn't produce
  // a huge delta spike on return.
  const timer = new Timer()
  timer.connect(document)

  function update(camera: Camera) {
    // Follow the camera on XZ so the player never reaches the plane's edge.
    water.position.set(camera.position.x, 0, camera.position.z)
    // Advance the water shader's clock so normals animate.
    timer.update()
    uniforms['time'].value += timer.getDelta()
  }

  return { mesh: water, update }
}
