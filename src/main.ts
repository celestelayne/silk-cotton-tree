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

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

const renderer = new WebGLRenderer({ canvas, antialias: true })
renderer.toneMapping = NoToneMapping
renderer.setPixelRatio(window.devicePixelRatio)

const scene = new Scene()
scene.background = new Color(FOG_COLOR)
scene.fog = new FogExp2(FOG_COLOR, FOG_DENSITY)

const camera = new PerspectiveCamera(FOV, 1, 0.1, 1000)
camera.position.set(0, CAMERA_HEIGHT, 0)
camera.rotation.set(CAMERA_PITCH, 0, 0)

const sky = createSky()
const ocean = createOcean()
scene.add(sky.mesh, ocean.mesh)

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

renderer.setAnimationLoop(() => {
  sky.update(camera)
  ocean.update(camera)
  renderer.render(scene, camera)
})
