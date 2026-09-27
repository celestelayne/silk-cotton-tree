import { Mesh, MeshBasicMaterial, PlaneGeometry, type Camera } from 'three'
import { OCEAN_COLOR, OCEAN_SIZE } from './config'

export function createOcean() {
  // Large flat plane in a single dark color — the scene's fog blends its far
  // edge into the sky, giving the illusion of an ocean stretching to the horizon.
  const mesh = new Mesh(
    new PlaneGeometry(OCEAN_SIZE, OCEAN_SIZE),
    new MeshBasicMaterial({ color: OCEAN_COLOR }),
  )
  // PlaneGeometry is created in the XY plane; rotate it flat onto the ground.
  mesh.rotation.x = -Math.PI / 2

  // Follow the camera on the XZ plane so the player never reaches the plane's
  // edge, while keeping y=0 so the horizon stays at eye level.
  function update(camera: Camera) {
    mesh.position.set(camera.position.x, 0, camera.position.z)
  }

  return { mesh, update }
}
