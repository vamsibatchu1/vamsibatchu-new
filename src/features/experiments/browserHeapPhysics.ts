import Matter from 'matter-js'

const { Engine, Bodies, Body, Composite } = Matter

/** Visual + collision scale while cards tumble into the heap */
export const HEAP_SCALE = 0.52

export type HeapCardInput = {
  id: string
  el: HTMLElement
  width: number
  height: number
  angleDeg?: number
}

/**
 * Matter.js world that drops browser cards into a messy bottom heap.
 * Drives DOM left/top/transform directly each frame (no React re-renders).
 */
export class BrowserHeap {
  private engine: Matter.Engine
  private field: HTMLElement
  private cards = new Map<
    string,
    { body: Matter.Body; el: HTMLElement; w: number; h: number }
  >()
  private raf = 0
  private running = false

  constructor(field: HTMLElement, width: number, height: number) {
    this.field = field
    this.engine = Engine.create({
      gravity: { x: 0, y: 1.55 },
    })

    const t = 72
    const walls = [
      Bodies.rectangle(width / 2, height + t / 2 - 2, width * 1.5, t, {
        isStatic: true,
        friction: 0.95,
        restitution: 0.12,
      }),
      Bodies.rectangle(-t / 2, height / 2, t, height * 2.4, {
        isStatic: true,
        friction: 0.35,
      }),
      Bodies.rectangle(width + t / 2, height / 2, t, height * 2.4, {
        isStatic: true,
        friction: 0.35,
      }),
    ]
    Composite.add(this.engine.world, walls)
  }

  add(card: HeapCardInput) {
    if (this.cards.has(card.id)) return

    const fieldRect = this.field.getBoundingClientRect()
    const elRect = card.el.getBoundingClientRect()
    const centerX = elRect.left - fieldRect.left + elRect.width / 2
    const centerY = elRect.top - fieldRect.top + elRect.height / 2

    const bw = card.width * HEAP_SCALE
    const bh = card.height * HEAP_SCALE
    const body = Bodies.rectangle(centerX, centerY, bw, bh, {
      restitution: 0.28,
      friction: 0.4,
      frictionAir: 0.018,
      density: 0.0022,
      angle: ((card.angleDeg ?? 0) * Math.PI) / 180,
      chamfer: { radius: 8 },
    })

    Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 5.5,
      y: 0.4 + Math.random() * 2.2,
    })
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.18)

    Composite.add(this.engine.world, body)
    this.cards.set(card.id, {
      body,
      el: card.el,
      w: card.width,
      h: card.height,
    })
    this.paint(card.id)
  }

  remove(id: string) {
    const card = this.cards.get(id)
    if (!card) return
    Composite.remove(this.engine.world, card.body)
    this.cards.delete(id)
    // Keep last painted left/top/transform so framer can spring home from the heap.
  }

  start() {
    if (this.running) return
    this.running = true
    let last = performance.now()

    const loop = (now: number) => {
      if (!this.running) return
      const dt = Math.min(34, now - last)
      last = now
      Engine.update(this.engine, dt)
      for (const id of this.cards.keys()) this.paint(id)
      this.raf = requestAnimationFrame(loop)
    }

    this.raf = requestAnimationFrame(loop)
  }

  destroy() {
    this.running = false
    cancelAnimationFrame(this.raf)
    for (const id of [...this.cards.keys()]) this.remove(id)
    Composite.clear(this.engine.world, false)
    Engine.clear(this.engine)
  }

  private paint(id: string) {
    const card = this.cards.get(id)
    if (!card) return
    const { body, el, w, h } = card
    el.style.left = `${body.position.x - w / 2}px`
    el.style.top = `${body.position.y - h / 2}px`
    el.style.transform = `rotate(${body.angle}rad) scale(${HEAP_SCALE})`
    el.style.transformOrigin = 'center center'
    el.style.opacity = '0.78'
  }
}
