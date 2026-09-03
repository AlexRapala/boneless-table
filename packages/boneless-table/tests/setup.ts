import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

declare module 'vitest' {
  interface Assertion<T> {
    toBeInTheDocument(): T
    toHaveAttribute(name: string, value?: string): T
    toHaveFocus(): T
    toHaveStyle(styles: Record<string, string>): T
    toHaveTextContent(text: string | RegExp): T
  }
}

expect.extend({
  toBeInTheDocument(received: Node | null) {
    const pass = received !== null && document.documentElement.contains(received)
    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
    }
  },
  toHaveAttribute(received: Element, name: string, value?: string) {
    const actual = received.getAttribute(name)
    const pass = value === undefined ? received.hasAttribute(name) : actual === value
    return {
      pass,
      message: () =>
        `expected element ${pass ? 'not ' : ''}to have attribute ${name}${
          value === undefined ? '' : `=${JSON.stringify(value)}`
        }; received ${JSON.stringify(actual)}`,
    }
  },
  toHaveFocus(received: Element) {
    const pass = document.activeElement === received
    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to have focus`,
    }
  },
  toHaveStyle(received: HTMLElement, styles: Record<string, string>) {
    const actual = getComputedStyle(received)
    const pass = Object.entries(styles).every(([property, value]) => {
      const cssProperty = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
      return actual.getPropertyValue(cssProperty) === value
    })
    return {
      pass,
      message: () =>
        `expected element ${pass ? 'not ' : ''}to have styles ${JSON.stringify(styles)}`,
    }
  },
  toHaveTextContent(received: Node, text: string | RegExp) {
    const actual = received.textContent ?? ''
    const pass = typeof text === 'string' ? actual.includes(text) : text.test(actual)
    return {
      pass,
      message: () =>
        `expected element ${pass ? 'not ' : ''}to have text ${String(text)}; received ${JSON.stringify(
          actual,
        )}`,
    }
  },
})

afterEach(cleanup)
