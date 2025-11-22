// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill Web APIs for Next.js
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Polyfill fetch and Web APIs
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url
    this.method = options.method || 'GET'
    this.headers = new Map(Object.entries(options.headers || {}))
    this.body = options.body
  }

  async json() {
    return JSON.parse(this.body || '{}')
  }

  async text() {
    return this.body || ''
  }
}

global.Headers = class Headers {
  constructor(init = {}) {
    this.map = new Map()
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.map.set(key.toLowerCase(), value)
      })
    }
  }

  get(name) {
    return this.map.get(name.toLowerCase())
  }

  set(name, value) {
    this.map.set(name.toLowerCase(), value)
  }

  has(name) {
    return this.map.has(name.toLowerCase())
  }
}

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body
    this.status = options.status || 200
    this.ok = this.status >= 200 && this.status < 300
    this.headers = new Headers(options.headers)
  }

  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
  }

  async text() {
    return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
  }
}

// Mock NextRequest for Jest
global.NextRequest = class NextRequest extends Request {
  constructor(url, options = {}) {
    super(url, options)
  }
}

// Mock NextResponse for Jest
global.NextResponse = class NextResponse extends Response {
  constructor(body, options = {}) {
    super(body, options)
  }

  static json(data, options = {}) {
    const jsonString = JSON.stringify(data)
    return new Response(jsonString, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  }
}
