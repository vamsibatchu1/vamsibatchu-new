import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'
import {
  practiceAxes,
  practiceConcepts,
  type PracticeConcept,
} from '../../data/practiceMap'

/** Ink / CAD map palette (white field, black wireframe). */
const INK = '#0a0a0a'
const INK_HOT = '#000000'
const PAPER = '#ffffff'

const AXIS = 1.35
const GRID = 8 // divisions per half-axis → dense blueprint cells

type PracticeMapVariant = 'full' | 'teaser'

type PracticeMapProps = {
  className?: string
  /** Height classes for the WebGL stage. */
  canvasClassName?: string
  /**
   * `teaser` — Home: pulled-back camera, muted labels until hover/select.
   * `full` — sandbox with denser chrome.
   */
  variant?: PracticeMapVariant
}

function gridLines(
  axisA: 'x' | 'y' | 'z',
  axisB: 'x' | 'y' | 'z',
): [number, number, number][][] {
  const lines: [number, number, number][][] = []
  const step = (AXIS * 2) / GRID
  for (let i = 0; i <= GRID; i++) {
    const t = -AXIS + i * step
    const a: [number, number, number] = [0, 0, 0]
    const b: [number, number, number] = [0, 0, 0]
    const c: [number, number, number] = [0, 0, 0]
    const d: [number, number, number] = [0, 0, 0]
    const set = (
      p: [number, number, number],
      ax: 'x' | 'y' | 'z',
      v: number,
    ) => {
      if (ax === 'x') p[0] = v
      if (ax === 'y') p[1] = v
      if (ax === 'z') p[2] = v
    }
    set(a, axisA, t)
    set(a, axisB, -AXIS)
    set(b, axisA, t)
    set(b, axisB, AXIS)
    set(c, axisB, t)
    set(c, axisA, -AXIS)
    set(d, axisB, t)
    set(d, axisA, AXIS)
    lines.push([a, b], [c, d])
  }
  return lines
}

function BlueprintGrid() {
  const xy = useMemo(() => gridLines('x', 'y'), [])
  const xz = useMemo(() => gridLines('x', 'z'), [])
  const yz = useMemo(() => gridLines('y', 'z'), [])

  return (
    <group>
      {xy.map((pts, i) => (
        <Line
          key={`xy-${i}`}
          points={pts}
          color={INK}
          lineWidth={0.5}
          transparent
          opacity={0.12}
        />
      ))}
      {xz.map((pts, i) => (
        <Line
          key={`xz-${i}`}
          points={pts}
          color={INK}
          lineWidth={0.5}
          transparent
          opacity={0.28}
        />
      ))}
      {yz.map((pts, i) => (
        <Line
          key={`yz-${i}`}
          points={pts}
          color={INK}
          lineWidth={0.5}
          transparent
          opacity={0.12}
        />
      ))}
    </group>
  )
}

function AxisLines() {
  const tick = 0.05
  const majors = [-1, -0.5, 0, 0.5, 1].map((n) => n * AXIS)

  return (
    <group>
      <Line
        points={[
          [-AXIS, 0, 0],
          [AXIS, 0, 0],
        ]}
        color={INK}
        lineWidth={1.25}
      />
      <Line
        points={[
          [0, -AXIS, 0],
          [0, AXIS, 0],
        ]}
        color={INK}
        lineWidth={1.25}
      />
      <Line
        points={[
          [0, 0, -AXIS],
          [0, 0, AXIS],
        ]}
        color={INK}
        lineWidth={1.25}
      />

      {/* Major ticks + numeric CAD labels on X */}
      {majors.map((v, i) => (
        <group key={`tx-${i}`}>
          <Line
            points={[
              [v, -tick, 0],
              [v, tick, 0],
            ]}
            color={INK}
            lineWidth={1}
          />
          <Html position={[v, -0.12, 0]} center style={{ pointerEvents: 'none' }}>
            <span className="blueprint-label">{(v / AXIS).toFixed(1)}</span>
          </Html>
        </group>
      ))}
      {majors.map((v, i) => (
        <group key={`ty-${i}`}>
          <Line
            points={[
              [-tick, v, 0],
              [tick, v, 0],
            ]}
            color={INK}
            lineWidth={1}
          />
          {v !== 0 ? (
            <Html position={[-0.14, v, 0]} center style={{ pointerEvents: 'none' }}>
              <span className="blueprint-label">{(v / AXIS).toFixed(1)}</span>
            </Html>
          ) : null}
        </group>
      ))}

      <AxisLabel position={[AXIS + 0.12, 0.08, 0]} text={practiceAxes.x.pos} />
      <AxisLabel position={[-AXIS - 0.12, 0.08, 0]} text={practiceAxes.x.neg} />
      <AxisLabel position={[0.1, AXIS + 0.1, 0]} text={practiceAxes.y.pos} />
      <AxisLabel position={[0.1, -AXIS - 0.1, 0]} text={practiceAxes.y.neg} />
      <AxisLabel position={[0.1, 0.08, AXIS + 0.12]} text={practiceAxes.z.pos} />
      <AxisLabel position={[0.1, 0.08, -AXIS - 0.12]} text={practiceAxes.z.neg} />

      {/* Origin crosshair */}
      <Line
        points={[
          [-tick * 2, 0, 0],
          [tick * 2, 0, 0],
        ]}
        color={INK}
        lineWidth={1.5}
      />
      <Line
        points={[
          [0, -tick * 2, 0],
          [0, tick * 2, 0],
        ]}
        color={INK}
        lineWidth={1.5}
      />
    </group>
  )
}

function AxisLabel({
  position,
  text,
}: {
  position: [number, number, number]
  text: string
}) {
  return (
    <Html position={position} center style={{ pointerEvents: 'none' }}>
      <span className="blueprint-axis">{text}</span>
    </Html>
  )
}

function NodeGeometry({ scale }: { scale: number }) {
  return <sphereGeometry args={[0.024 * scale, 14, 14]} />
}

function ConceptNode({
  concept,
  selected,
  spotlight,
  onSelect,
  scale,
  teaser,
}: {
  concept: PracticeConcept
  selected: boolean
  /** Auto-cycled focus in teaser mode — only this label is shown. */
  spotlight: boolean
  onSelect: (id: string) => void
  scale: number
  teaser: boolean
}) {
  const group = useRef<Group>(null)
  const mesh = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const lit = selected || spotlight || hovered
  const base = useMemo(
    () =>
      new THREE.Vector3(
        concept.x * AXIS * 0.92,
        concept.y * AXIS * 0.92,
        concept.z * AXIS * 0.92,
      ),
    [concept.x, concept.y, concept.z],
  )
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const drag = useRef<{
    ox: number
    oy: number
    oz: number
    px: number
    py: number
  } | null>(null)
  const offset = useRef(new THREE.Vector3())

  useFrame(({ clock }, delta) => {
    const g = group.current
    if (!g) return
    const t = clock.elapsedTime
    const floatY = Math.sin(t * 0.7 + phase) * 0.018
    const floatX = Math.cos(t * 0.55 + phase) * 0.012
    const target = base
      .clone()
      .add(offset.current)
      .add(new THREE.Vector3(floatX, floatY, 0))
    g.position.lerp(target, 1 - Math.exp(-6 * delta))

    if (!drag.current) {
      offset.current.lerp(new THREE.Vector3(0, 0, 0), 1 - Math.exp(-4 * delta))
    }

    if (mesh.current) {
      const s = lit ? 1.35 : 1
      mesh.current.scale.lerp(
        new THREE.Vector3(s, s, s),
        1 - Math.exp(-10 * delta),
      )
    }
  })

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    drag.current = {
      ox: offset.current.x,
      oy: offset.current.y,
      oz: offset.current.z,
      px: e.clientX,
      py: e.clientY,
    }
    onSelect(concept.id)
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current) return
    e.stopPropagation()
    const dx = (e.clientX - drag.current.px) * 0.0025
    const dy = -(e.clientY - drag.current.py) * 0.0025
    offset.current.set(
      drag.current.ox + dx,
      drag.current.oy + dy,
      drag.current.oz,
    )
  }

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    drag.current = null
  }

  const showLabel = !teaser || lit
  const handlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave: onPointerUp,
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      setHovered(true)
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      setHovered(false)
      document.body.style.cursor = 'auto'
    },
  }

  return (
    <group ref={group} position={base.toArray()}>
      <mesh ref={mesh} {...handlers}>
        <NodeGeometry scale={scale} />
        <meshBasicMaterial color={lit ? INK_HOT : INK} toneMapped={false} />
      </mesh>
      {showLabel ? (
        <Html position={[0.05, 0.035, 0]} zIndexRange={[10, 0]}>
          <button
            type="button"
            onPointerDown={(ev) => ev.stopPropagation()}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onClick={(ev) => {
              ev.stopPropagation()
              onSelect(concept.id)
            }}
            className={`blueprint-term max-w-[9rem] cursor-pointer select-none whitespace-nowrap text-left text-[9px] lowercase leading-tight tracking-[0.02em] lg:text-[10px] ${
              selected ? 'is-active' : ''
            } ${spotlight && !selected ? 'is-spotlight' : ''} ${
              hovered && teaser ? 'is-hot' : ''
            }`}
          >
            {concept.label}
          </button>
        </Html>
      ) : null}
    </group>
  )
}

function MapScene({
  selectedId,
  onSelect,
  teaser,
}: {
  selectedId: string | null
  onSelect: (id: string | null) => void
  teaser: boolean
}) {
  const root = useRef<Group>(null)
  const idle = useRef(true)
  const [spotlightId, setSpotlightId] = useState(
    () => practiceConcepts[0]?.id ?? null,
  )

  useEffect(() => {
    if (!teaser || practiceConcepts.length === 0) return
    const tick = window.setInterval(() => {
      // Pause auto-tour while the user has a selection locked in
      if (selectedId) return
      setSpotlightId((cur) => {
        const i = practiceConcepts.findIndex((c) => c.id === cur)
        const next = (i + 1) % practiceConcepts.length
        return practiceConcepts[next].id
      })
    }, 2000)
    return () => window.clearInterval(tick)
  }, [teaser, selectedId])

  useFrame((_, delta) => {
    if (!idle.current || !root.current) return
    root.current.rotation.y += delta * 0.06
  })

  const focusId = selectedId ?? (teaser ? spotlightId : null)

  return (
    <>
      <color attach="background" args={[PAPER]} />
      <ambientLight intensity={1} />
      <group ref={root}>
        <BlueprintGrid />
        <AxisLines />
        {practiceConcepts.map((c) => (
          <ConceptNode
            key={c.id}
            concept={c}
            selected={selectedId === c.id}
            spotlight={teaser && focusId === c.id}
            onSelect={(id) => {
              idle.current = false
              onSelect(id)
            }}
            scale={1}
            teaser={teaser}
          />
        ))}
      </group>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={teaser ? 1.9 : 1.35}
        maxDistance={teaser ? 6.3 : 5.5}
        enablePan={!teaser}
        onStart={() => {
          idle.current = false
        }}
      />
    </>
  )
}

/**
 * Fidgetable 3D practice map — blueprint / CAD aesthetic.
 */
export default function PracticeMap({
  className = '',
  canvasClassName = 'h-[min(62dvh,560px)] lg:h-[min(68dvh,640px)]',
  variant = 'full',
}: PracticeMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const teaser = variant === 'teaser'

  const onSelect = useCallback((id: string | null) => {
    setSelectedId((cur) => (cur === id ? null : id))
  }, [])

  return (
    <div
      className={`practice-map relative flex w-full flex-col overflow-hidden bg-white ${
        teaser ? 'is-teaser' : ''
      } ${className}`}
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
    >
      <div className={`relative w-full shrink-0 touch-none ${canvasClassName}`}>
        <Canvas
          camera={{
            position: teaser ? [2.45, 1.57, 2.69] : [1.68, 1.12, 1.89],
            fov: 42,
            near: 0.1,
            far: 40,
          }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: false }}
          onPointerMissed={() => setSelectedId(null)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <MapScene
            selectedId={selectedId}
            onSelect={onSelect}
            teaser={teaser}
          />
        </Canvas>
      </div>

      <style>{`
        .practice-map {
          border: 1px solid ${INK};
          color: ${INK};
        }
        .blueprint-label {
          color: ${INK};
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 8px;
          letter-spacing: 0.06em;
          user-select: none;
          opacity: 0.75;
        }
        .practice-map.is-teaser .blueprint-label {
          opacity: 0;
        }
        .blueprint-axis {
          color: ${INK};
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: lowercase;
          user-select: none;
          white-space: nowrap;
        }
        .practice-map.is-teaser .blueprint-axis {
          opacity: 0.4;
        }
        .blueprint-term {
          color: ${INK};
          font-family: "JetBrains Mono", ui-monospace, monospace;
          opacity: 0.8;
          background: transparent;
          border: 0;
          padding: 0;
        }
        .practice-map.is-teaser .blueprint-term {
          opacity: 1;
        }
        .blueprint-term:hover,
        .blueprint-term.is-active,
        .blueprint-term.is-hot,
        .blueprint-term.is-spotlight {
          opacity: 1;
          color: ${PAPER};
          background: ${INK};
          text-decoration: none;
          padding: 1px 4px 2px;
        }
      `}</style>
    </div>
  )
}
