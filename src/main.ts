import {
  Color,
  MathUtils,
  NoToneMapping,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import './styles.css'
import {
  CAMERA_HEIGHT,
  CAMERA_PITCH,
  FOG_COLOR,
  FOV,
  LOOK_LAG_ALPHA,
  LOOK_PITCH_DEG,
  LOOK_RETURN_ALPHA,
  LOOK_YAW_DEG,
} from './scene/config'
import { createHorizonMist } from './scene/HorizonMist'
import { createOcean } from './scene/Ocean'
import { createSky } from './scene/Sky'

// Create the canvas element and mount it into the page.
const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

// WebGL renderer. NoToneMapping keeps the sky image's colors 1:1 with the source.
const renderer = new WebGLRenderer({ canvas, antialias: true })
renderer.toneMapping = NoToneMapping
renderer.setPixelRatio(window.devicePixelRatio)

// Scene. No scene fog: the horizon mist band softens where the sky meets the ocean.
const scene = new Scene()
scene.background = new Color(FOG_COLOR)

// Camera pitched up by CAMERA_PITCH so the scene horizon aligns with the image horizon.
const camera = new PerspectiveCamera(FOV, 1, 0.1, 1000)
camera.position.set(0, CAMERA_HEIGHT, 0)
camera.rotation.set(CAMERA_PITCH, 0, 0)

// Drag-to-look: OrbitControls drives a dummy camera around a target just in
// front of it. The real camera slerps toward the dummy each frame (input-lag
// smoothing). When the user isn't dragging, the dummy eases back toward its
// starting position so the look direction drifts back to forward.
const dummy = new PerspectiveCamera(FOV, 1, 0.1, 1000)
dummy.position.copy(camera.position)
dummy.rotation.copy(camera.rotation)

const initialTarget = camera
  .getWorldDirection(new Vector3())
  .multiplyScalar(0.01)
  .add(camera.position)
const initialDummyPosition = dummy.position.clone()

const controls = new OrbitControls(dummy, canvas)
controls.target.copy(initialTarget)
// Zoom and pan would move the camera off its spot.
controls.enableZoom = false
controls.enablePan = false
// Smoothing is done via the main-camera lerp below.
controls.enableDamping = false
controls.update()

// Clamp the drag to a narrow range around the initial look direction.
const initialAz = controls.getAzimuthalAngle()
const initialPo = controls.getPolarAngle()
controls.minAzimuthAngle = initialAz - MathUtils.degToRad(LOOK_YAW_DEG)
controls.maxAzimuthAngle = initialAz + MathUtils.degToRad(LOOK_YAW_DEG)
controls.minPolarAngle = initialPo - MathUtils.degToRad(LOOK_PITCH_DEG)
controls.maxPolarAngle = initialPo + MathUtils.degToRad(LOOK_PITCH_DEG)

let isDragging = false
controls.addEventListener('start', () => (isDragging = true))
controls.addEventListener('end', () => (isDragging = false))

// Build the scene layers: the sky (backdrop), the ocean (ground), and the mist band over the horizon.
const sky = createSky()
const ocean = createOcean()
const mist = createHorizonMist()
scene.add(sky.mesh, ocean.mesh, mist.mesh)

// Keep the renderer, camera aspect, and sky geometry in sync with the window size.
function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  sky.resize(w / h)
}
window.addEventListener('resize', resize)
resize()

// Render loop: reposition sky/ocean/mist to follow the camera, then draw a frame.
renderer.setAnimationLoop(() => {
  // Auto-return: while idle, ease the dummy's position back toward its start,
  // which pulls the orbit angle back toward forward.
  if (!isDragging) {
    dummy.position.lerp(initialDummyPosition, LOOK_RETURN_ALPHA)
  }
  controls.update()
  // Input-lag smoothing: the main camera catches up to the dummy over multiple frames.
  camera.quaternion.slerp(dummy.quaternion, LOOK_LAG_ALPHA)
  sky.update(camera)
  ocean.update(camera)
  mist.update(camera)
  renderer.render(scene, camera)
})
