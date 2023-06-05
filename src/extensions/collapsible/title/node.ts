/* eslint-disable @typescript-eslint/no-use-before-define */
import lexical, {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  SerializedElementNode,
} from 'lexical';

import { $isCollapsibleContainerNode } from '../container/node.js';
import { $isCollapsibleContentNode } from '../content/node.js';

type SerializedCollapsibleTitleNode = SerializedElementNode;

export function convertSummaryElement(domNode: HTMLElement): DOMConversionOutput | null {
  const node = $createCollapsibleTitleNode();
  return {
    node,
  };
}

/**
 * A Lexical node to represent an HTML summary element
 */
export class CollapsibleTitleNode extends lexical.ElementNode {
  static getType(): string {
    return 'collapsible-title';
  }

  static clone(node: CollapsibleTitleNode): CollapsibleTitleNode {
    return new CollapsibleTitleNode(node.__key);
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement('summary');
    dom.classList.add('Collapsible__title');
    return dom;
  }

  updateDOM(prevNode: CollapsibleTitleNode, dom: HTMLElement): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      summary: (domNode: HTMLElement) => {
        return {
          conversion: convertSummaryElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedCollapsibleTitleNode): CollapsibleTitleNode {
    return $createCollapsibleTitleNode();
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('summary');
    return { element };
  }

  exportJSON(): SerializedCollapsibleTitleNode {
    return {
      ...super.exportJSON(),
      type: 'collapsible-title',
      version: 1,
    };
  }

  collapseAtStart(_selection: RangeSelection): boolean {
    this.getParentOrThrow().insertBefore(this);
    return true;
  }

  insertNewAfter(_: RangeSelection, restoreSelection = true): lexical.ElementNode {
    const containerNode = this.getParentOrThrow();

    if (!$isCollapsibleContainerNode(containerNode)) {
      throw new Error('CollapsibleTitleNode expects to be child of CollapsibleContainerNode');
    }

    if (containerNode.getOpen()) {
      const contentNode = this.getNextSibling();
      if (!$isCollapsibleContentNode(contentNode)) {
        throw new Error('CollapsibleTitleNode expects to have CollapsibleContentNode sibling');
      }

      const firstChild = contentNode.getFirstChild();
      if (lexical.$isElementNode(firstChild)) {
        return firstChild;
      } else {
        const paragraph = lexical.$createParagraphNode();
        contentNode.append(paragraph);
        return paragraph;
      }
    } else {
      const paragraph = lexical.$createParagraphNode();
      containerNode.insertAfter(paragraph, restoreSelection);
      return paragraph;
    }
  }
}

/**
 * Creates a Collapsible Title node
 *
 * @returns A Collapsible Title node
 */
export function $createCollapsibleTitleNode(): CollapsibleTitleNode {
  return new CollapsibleTitleNode();
}

/**
 * A typeguard function to assert on a Collapsible Title node
 *
 * @param node A Lexical node
 * @returns true if the node is a Collapsible Title node, otherwise false
 */
export function $isCollapsibleTitleNode(node: LexicalNode | null | undefined): node is CollapsibleTitleNode {
  return node instanceof CollapsibleTitleNode;
}
