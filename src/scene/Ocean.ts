import { Mesh, MeshBasicMaterial, PlaneGeometry, type Camera } from 'three'
import { OCEAN_COLOR, OCEAN_SIZE } from './config'

export function createOcean() {
  const mesh = new Mesh(
    new PlaneGeometry(OCEAN_SIZE, OCEAN_SIZE),
    new MeshBasicMaterial({ color: OCEAN_COLOR }),
  )
  mesh.rotation.x = -Math.PI / 2

  function update(camera: Camera) {
    mesh.position.set(camera.position.x, 0, camera.position.z)
  }

  return { mesh, update }
}
