/* eslint-disable @typescript-eslint/no-use-before-define */
import lexical, {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from 'lexical';

type SerializedCollapsibleContainerNode = Spread<
  {
    open: boolean;
  },
  SerializedElementNode
>;

export function convertDetailsElement(domNode: HTMLDetailsElement): DOMConversionOutput | null {
  const openAttr = domNode.getAttribute('open');
  const isOpen = openAttr !== null ? openAttr === 'true' : true;
  const node = $createCollapsibleContainerNode(isOpen);
  return {
    node,
  };
}

/**
 * A Lexical node to represent an HTML details container
 */
export class CollapsibleContainerNode extends lexical.ElementNode {
  __open: boolean;

  constructor(open: boolean, key?: NodeKey) {
    super(key);
    this.__open = open;
  }

  static getType(): string {
    return 'collapsible-container';
  }

  static clone(node: CollapsibleContainerNode): CollapsibleContainerNode {
    return new CollapsibleContainerNode(node.__open, node.__key);
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement('details');
    dom.classList.add('Collapsible__container');
    dom.open = this.__open;
    dom.addEventListener('toggle', () => {
      const open = editor.getEditorState().read(() => this.getOpen());
      if (open !== dom.open) {
        editor.update(() => this.toggleOpen());
      }
    });
    return dom;
  }

  updateDOM(prevNode: CollapsibleContainerNode, dom: HTMLDetailsElement): boolean {
    if (prevNode.__open !== this.__open) {
      dom.open = this.__open;
    }

    return false;
  }

  static importDOM(): DOMConversionMap<HTMLDetailsElement> | null {
    return {
      details: (domNode: HTMLDetailsElement) => {
        return {
          conversion: convertDetailsElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedCollapsibleContainerNode): CollapsibleContainerNode {
    const node = $createCollapsibleContainerNode(serializedNode.open);
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('details');
    element.setAttribute('open', this.__open.toString());
    return { element };
  }

  exportJSON(): SerializedCollapsibleContainerNode {
    return {
      ...super.exportJSON(),
      open: this.__open,
      type: 'collapsible-container',
      version: 1,
    };
  }

  /**
   * Sets the open state of the details container
   */
  setOpen(open: boolean): void {
    const writable = this.getWritable();
    writable.__open = open;
  }

  /**
   * Gets the open state of the details container
   */
  getOpen(): boolean {
    return this.getLatest().__open;
  }

  /**
   * Toggles the open state of the details container
   */
  toggleOpen(): void {
    this.setOpen(!this.getOpen());
  }
}

/**
 * Creates a Collapsible Container node with an initial open state
 *
 * @param isOpen The initial open state of the container
 * @returns A Collapsible Container node
 */
export function $createCollapsibleContainerNode(isOpen: boolean): CollapsibleContainerNode {
  return new CollapsibleContainerNode(isOpen);
}

/**
 * A typeguard function to assert on a Collapsible Container node
 *
 * @param node A Lexical node
 * @returns true if the node is a Collapsible Container node, otherwise false
 */
export function $isCollapsibleContainerNode(node: LexicalNode | null | undefined): node is CollapsibleContainerNode {
  return node instanceof CollapsibleContainerNode;
}
