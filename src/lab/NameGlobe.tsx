import { Canvas, useFrame } from '@react-three/fiber'
import { Outlines } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

export type NameGlobeProps = {
  /** Top line wrapped on the sphere (default: vamsi). */
  line1?: string
  /** Bottom line wrapped on the sphere (default: batchu). */
  line2?: string
  /** Slow Y-axis spin. */
  autoRotate?: boolean
  /** Extra class on the outer wrapper. */
  className?: string
  /** CSS background behind the WebGL canvas. */
  background?: string
}

function makeNameTexture(line1: string, line2: string) {
  const width = 2048
  const height = 1024
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas unavailable')

  // Sphere body — slightly warm white like the reference
  ctx.fillStyle = '#f4f1e8'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#000000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font =
    '700 168px "JetBrains Mono", "Helvetica Neue", Helvetica, Arial, sans-serif'

  // Center band of the equirectangular map → front of the globe
  const cx = width * 0.5
  ctx.fillText(line1.toUpperCase(), cx, height * 0.42)
  ctx.fillText(line2.toUpperCase(), cx, height * 0.58)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function GlobeMesh({
  line1,
  line2,
  autoRotate,
}: {
  line1: string
  line2: string
  autoRotate: boolean
}) {
  const group = useRef<Group>(null)
  const mesh = useRef<Mesh>(null)

  const texture = useMemo(() => makeNameTexture(line1, line2), [line1, line2])

  useEffect(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])

  useFrame((_, delta) => {
    if (!autoRotate || !group.current) return
    group.current.rotation.y += delta * 0.22
  })

  return (
    <group ref={group} rotation={[0, Math.PI, 0]}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1.35, 96, 96]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
        <Outlines thickness={3.5} color="#000000" screenspace />
      </mesh>
    </group>
  )
}

/**
 * Flat graphic 3D name globe — white sphere, black outline, name wrapped on surface.
 * Drop onto any page: `<NameGlobe />` or `<NameGlobe line1="vamsi" line2="batchu" />`.
 */
export default function NameGlobe({
  line1 = 'vamsi',
  line2 = 'batchu',
  autoRotate = true,
  className = '',
  background = '#ebe7d3',
}: NameGlobeProps) {
  return (
    <div
      className={`relative aspect-square w-full overflow-hidden ${className}`}
      style={{ background }}
      role="img"
      aria-label={`${line1} ${line2} name globe`}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GlobeMesh line1={line1} line2={line2} autoRotate={autoRotate} />
      </Canvas>
    </div>
  )
}
