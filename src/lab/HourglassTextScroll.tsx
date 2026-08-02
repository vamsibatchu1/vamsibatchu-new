import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Mesh } from 'three'
import * as THREE from 'three'

export type HourglassTextScrollProps = {
  /** Lines wrapped on the hourglass (uppercase in render). */
  lines?: string[]
  /** Vertical UV scroll speed (loops/sec of one line-block). */
  speed?: number
  /** Extra class on the outer wrapper. */
  className?: string
  /** CSS background behind the WebGL canvas. */
  background?: string
}

/** Reference Echobox flyer copy — used to match the source motion. */
export const HOURGLASS_REFERENCE_LINES = [
  'ALTERNATIVE PLANET FM',
  'W/ TASH LC ANZ &',
  'SPECIAL REQUEST',
  'ECHOBOX PRESENTS W/',
  'APRIL222. ART OF DJING',
  'LIVE: FREDDY K ARUSHI',
  'JAIN ECHOBOX',
  'W/ TASH LC ANZ &',
  'SPECIAL REQUEST',
  'ALTERNATIVE PLANET FM',
]

/**
 * Measured from the reference frame (540²):
 * silhouette half-width ≈ 119.5 + 95.9·Y²  (Y ∈ [-1,1])
 * → ends/center ≈ 1.80
 */
const R_CENTER = 0.48
const R_ENDS = R_CENTER * 1.8
const HALF_HEIGHT = 1.55
/** Fraction of circumference the readable front band covers (~140°). */
const FRONT_U = 0.4

function drawScrollTexture(lines: string[]) {
  const width = 2048
  const height = 4096
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas unavailable')

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, width, height)

  const band = lines.map((l) => l.toUpperCase())
  // Duplicate so offset.y wrapping is seamless across one block.
  const block = [...band, ...band]
  const rowH = height / block.length
  const fontSize = Math.floor(rowH * 0.7)
  const bandW = width * FRONT_U
  const bandLeft = (width - bandW) / 2

  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${fontSize}px "Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif`

  const tracking = fontSize * 0.02

  for (let i = 0; i < block.length; i++) {
    const text = block[i]
    const y = (i + 0.5) * rowH

    // Measure natural width, then scale to fill the front arc
    let natural = 0
    for (const ch of text) natural += ctx.measureText(ch).width + tracking
    natural -= tracking
    const scale = Math.min(1.15, (bandW * 0.92) / Math.max(natural, 1))

    ctx.save()
    ctx.translate(width / 2, y)
    ctx.scale(scale, 1)

    let x = -natural / 2
    for (const ch of text) {
      const w = ctx.measureText(ch).width
      ctx.textAlign = 'left'
      ctx.fillText(ch, x, 0)
      x += w + tracking
    }
    ctx.restore()

    // Keep sides pure black past the front arc (avoids ghosting around the back)
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, i * rowH, bandLeft, rowH)
    ctx.fillRect(bandLeft + bandW, i * rowH, bandLeft, rowH)
    ctx.fillStyle = '#ffffff'
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 0.5)
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function HourglassMesh({
  lines,
  speed,
}: {
  lines: string[]
  speed: number
}) {
  const mesh = useRef<Mesh>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)

  const geometry = useMemo(() => {
    const segments = 80
    const points: THREE.Vector2[] = []
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const Y = t * 2 - 1
      const r = R_CENTER + (R_ENDS - R_CENTER) * Y * Y
      points.push(new THREE.Vector2(r, Y * HALF_HEIGHT))
    }
    return new THREE.LatheGeometry(points, 160)
  }, [])

  useEffect(() => {
    let cancelled = false
    const build = () => {
      if (cancelled) return
      const next = drawScrollTexture(lines)
      textureRef.current?.dispose()
      textureRef.current = next
      setTexture(next)
    }
    if (document.fonts?.ready) {
      void document.fonts.ready.then(build)
    } else {
      build()
    }
    return () => {
      cancelled = true
      textureRef.current?.dispose()
      textureRef.current = null
    }
  }, [lines])

  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  useFrame((_, delta) => {
    const map = textureRef.current
    if (!map) return
    // Bottom → top
    map.offset.y = (map.offset.y - delta * speed) % 1
  })

  if (!texture) return null

  // Face the camera: Lathe starts at +X; rotate so front band is toward +Z camera
  return (
    <mesh ref={mesh} geometry={geometry} rotation={[0, Math.PI / 2, 0]}>
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/**
 * Hourglass kinetic type — white caps on a black hyperboloid, scrolling bottom→top.
 * Recreates the Echobox / Alternative Planet FM flyer motion from the reference GIF.
 */
export default function HourglassTextScroll({
  lines = HOURGLASS_REFERENCE_LINES,
  speed = 0.07,
  className = '',
  background = '#000000',
}: HourglassTextScrollProps) {
  return (
    <div
      className={`relative aspect-square w-full overflow-hidden ${className}`}
      style={{ background }}
      role="img"
      aria-label="Scrolling hourglass typography"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.1], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <HourglassMesh lines={lines} speed={speed} />
      </Canvas>
    </div>
  )
}
