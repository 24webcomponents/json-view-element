const css = String.raw
const stylesheet = new CSSStyleSheet()
stylesheet.replaceSync(css`
:host {
  font-family: monospace;
}
details > * {
  padding-inline-start: 0.5rem;
}
details > details {
  padding-inline-start: 1rem;
}
details > summary {
  padding-inline-start: 0;
  display: inline-block;
}
summary::before {
  content: '+ '
}
details[open] > summary::before {
  content: '- '
}
details[open] > summary::after {
  content: ':'
}
.boolean {
  color: orange;
}
.string {
  color: red;
}
.number {
  color: hotpink;
}
.null {
  color: grey;
}
`)

/**
 * An example Custom Element. This documentation ends up in the
 * README so describe how this elements works here.
 *
 * You can event add examples on the element is used with Markdown.
 *
 * ```
 * <tree-view></tree-view>
 * ```
 */
class JSONViewElement extends HTMLElement {
  #renderRoot!: ShadowRoot
  
  get json() {
    return JSON.parse(this.querySelector('script[type="application/json"]')?.textContent)
  }

  get expanded() {
    return this.hasAttribute('expanded')
  }

  connectedCallback(): void {
    this.#renderRoot = this.attachShadow({mode: 'open'})
    this.#renderRoot.append(this.#buildHTML())
    this.#renderRoot.adoptedStyleSheets = [stylesheet]
  }

  #buildHTML(): Node {
    const fragment = document.createDocumentFragment()
    try {
      for(const [key, value] of Object.entries(this.json)) {
        fragment.append(this.#buildNode(key, value))
      }
    } catch (error) {
      const span = document.createElement('span')
      span.classList.add('error')
      span.textContent = error.message
      return span
    }
    return fragment
  }

  #buildNode(key: string, value: unknown): Node {
    const details = document.createElement('details')
    details.open = this.expanded
    const summary = document.createElement('summary')
    summary.textContent = key
    details.append(summary)
    if (value && Array.isArray(value)) {
      const span = document.createElement('span')
      span.textContent = '[]'
      details.append(span)
      for (const item of Object.entries(value)) {
        details.append(this.#buildNode(...item))
      }
    } else if (value && typeof value === 'object') {
      const span = document.createElement('span')
      span.textContent = '{}'
      details.append(span)
      for (const item of Object.entries(value)) {
        details.append(this.#buildNode(...item))
      }
    } else if (typeof value === 'string') {
      const span = document.createElement('span')
      span.classList.add(typeof value)
      span.textContent = `"${value}"`
      details.append(span)
      details.open = true
    } else if (!value || typeof value === 'boolean' || typeof value === 'number') {
      const span = document.createElement('span')
      span.classList.add(value === null ? 'null' : typeof value)
      span.textContent = `${value}`
      details.append(span)
      details.open = true
    }
    return details
  }
}

declare global {
  interface Window {
    JSONViewElement: typeof JSONViewElement
  }
}

export default JSONViewElement

if (!window.customElements.get('json-view')) {
  window.JSONViewElement = JSONViewElement
  window.customElements.define('json-view', JSONViewElement)
}
