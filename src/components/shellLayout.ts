/**
 * Shared shell layout tokens — one container, two gutters (mobile / lg+).
 * Pages should not invent competing px/max-width on mobile.
 */
export const shellMax = 'mx-auto w-full max-w-6xl'

/** Horizontal inset inside the shell (matches Layout main + desktop header). */
export const shellPadX = 'px-4 lg:px-10'

/** Cancel shellPadX when a section needs edge-to-edge (e.g. Experiments). */
export const shellBleedX = '-mx-4 lg:-mx-10'

/** Vertical rhythm between major Home-style sections. */
export const shellSectionY = 'py-8 lg:py-12'

/** Layout <main> padding (includes mobile bottom-nav clearance). */
export const shellMainPad = `${shellPadX} pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] pt-6 lg:pb-12 lg:pt-12`
