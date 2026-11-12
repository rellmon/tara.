import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom is a pretend browser. It lacks a few browser features our app uses,
// so we give it do-nothing versions.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

Object.defineProperty(window, 'scrollTo', { writable: true, value: () => {} })

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: NoopObserver,
})
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: NoopObserver,
})

// <dialog> is only partly implemented in jsdom. This makes our confirm
// dialog open and close the way a real browser's does.
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function showModal(
    this: HTMLDialogElement,
  ) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
}

// Every test starts with no mocks, nothing rendered, and empty storage.
afterEach(() => {
  vi.restoreAllMocks()
  cleanup()
  localStorage.clear()
})