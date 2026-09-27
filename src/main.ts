import {
  Color,
  NoToneMapping,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import './styles.css'
import { CAMERA_HEIGHT, CAMERA_PITCH, FOG_COLOR, FOV } from './scene/config'
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

// Look around in place: orbiting a target just in front of the camera turns it without moving it.
// Read the direction before creating the controls: the constructor points the camera at the origin.
const initialTarget = camera.getWorldDirection(new Vector3()).multiplyScalar(0.01).add(camera.position)
const controls = new OrbitControls(camera, canvas)
controls.target.copy(initialTarget)
controls.enableDamping = true
// Zoom and pan would move the camera off its spot.
controls.enableZoom = false
controls.enablePan = false
controls.update()

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
  controls.update()
  sky.update(camera)
  ocean.update(camera)
  mist.update(camera)
  renderer.render(scene, camera)
})
