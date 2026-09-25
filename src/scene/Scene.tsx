import { OrbitControls } from '@react-three/drei'
import { Box } from './Box'

export function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Box />
      <OrbitControls />
    </>
  )
}
