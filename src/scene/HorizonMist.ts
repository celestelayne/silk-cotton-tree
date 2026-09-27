import {
  BackSide,
  Color,
  CylinderGeometry,
  MathUtils,
  Mesh,
  ShaderMaterial,
  type Camera,
} from 'three'
import { MIST_COLOR, MIST_FALLOFF, MIST_OPACITY, MIST_RADIUS, MIST_SPREAD_DEG } from './config'

export function createHorizonMist() {
  // Full ring around the viewer, centered on eye level (the horizon). Its height
  // is set so the band reaches MIST_SPREAD_DEG above and below the horizon.
  const height = 2 * MIST_RADIUS * Math.tan(MathUtils.degToRad(MIST_SPREAD_DEG))
  const geometry = new CylinderGeometry(MIST_RADIUS, MIST_RADIUS, height, 64, 1, true)

  // Opaque-ish at the horizon, fading to transparent at the top and bottom edges.
  const material = new ShaderMaterial({
    uniforms: {
      uColor: { value: new Color(MIST_COLOR) },
      uOpacity: { value: MIST_OPACITY },
      uFalloff: { value: MIST_FALLOFF },
    },
    vertexShader: /* glsl */ `
      varying float vV;
      void main() {
        vV = uv.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uFalloff;
      varying float vV;
      void main() {
        // 0 at the horizon line, 1 at the band's top and bottom edges.
        float t = abs(vV - 0.5) * 2.0;
        float alpha = uOpacity * pow(1.0 - smoothstep(0.0, 1.0, t), uFalloff);
        gl_FragColor = vec4(uColor, alpha);
        #include <colorspace_fragment>
      }
    `,
    side: BackSide,
    transparent: true,
    // Draw over both the sky and the ocean, regardless of depth.
    depthTest: false,
    depthWrite: false,
  })

  const mesh = new Mesh(geometry, material)
  mesh.renderOrder = 1

  // Stay centered on the camera at eye level, so the band always sits on the horizon.
  function update(camera: Camera) {
    mesh.position.copy(camera.position)
  }

  return { mesh, update }
}
