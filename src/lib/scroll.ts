import type Lenis from 'lenis';

// Shared handle to the single Lenis instance created in App, so any
// component can scroll without fighting the smooth-scroll loop.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

// Pause page scrolling while an overlay (e.g. the project modal) is open
export function lockScroll(locked: boolean) {
  if (locked) instance?.stop();
  else instance?.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

export function scrollToTarget(target: string | number) {
  if (instance) {
    instance.scrollTo(target);
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
}
