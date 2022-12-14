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
class TreeViewElement extends HTMLElement {
  connectedCallback(): void {

  }
}

declare global {
  interface Window {
    TreeViewElement: typeof TreeViewElement
  }
}

export default TreeViewElement

if (!window.customElements.get('tree-view')) {
  window.TreeViewElement = TreeViewElement
  window.customElements.define('tree-view', TreeViewElement)
}
