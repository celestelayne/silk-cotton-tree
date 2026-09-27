import {
  Color,
  FogExp2,
  NoToneMapping,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import './styles.css'
import { CAMERA_HEIGHT, CAMERA_PITCH, FOG_COLOR, FOG_DENSITY, FOV } from './scene/config'
import { createOcean } from './scene/Ocean'
import { createSky } from './scene/Sky'

// Create the canvas element and mount it into the page.
const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

// WebGL renderer. NoToneMapping keeps the sky image's colors 1:1 with the source.
const renderer = new WebGLRenderer({ canvas, antialias: true })
renderer.toneMapping = NoToneMapping
renderer.setPixelRatio(window.devicePixelRatio)

// Scene with exponential fog so the ocean fades into the sky at the horizon.
const scene = new Scene()
scene.background = new Color(FOG_COLOR)
scene.fog = new FogExp2(FOG_COLOR, FOG_DENSITY)

// Camera pitched up by CAMERA_PITCH so the scene horizon aligns with the image horizon.
const camera = new PerspectiveCamera(FOV, 1, 0.1, 1000)
camera.position.set(0, CAMERA_HEIGHT, 0)
camera.rotation.set(CAMERA_PITCH, 0, 0)

// Build the two scene layers: the sky plane (backdrop) and the ocean plane (ground).
const sky = createSky()
const ocean = createOcean()
scene.add(sky.mesh, ocean.mesh)

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

// Render loop: reposition sky/ocean to follow the camera, then draw a frame.
renderer.setAnimationLoop(() => {
  sky.update(camera)
  ocean.update(camera)
  renderer.render(scene, camera)
})
