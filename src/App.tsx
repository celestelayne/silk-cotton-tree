import { Canvas } from '@react-three/fiber'
import { Scene } from './scene/Scene'

export default function App() {
  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 60 }}>
      <Scene />
    </Canvas>
  )
}
