/* istanbul ignore file */
import { addClassNamesToElement } from '@lexical/utils';
import {
  $applyNodeReplacement,
  $createParagraphNode,
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  ElementNode,
  LexicalNode,
  ParagraphNode,
  RangeSelection,
  SerializedElementNode,
} from 'lexical';

export type SerializedQuoteNode = SerializedElementNode;

/** @noInheritDoc */
export class QuoteNode extends ElementNode {
  static getType(): string {
    return 'quote';
  }

  static clone(node: QuoteNode): QuoteNode {
    return new QuoteNode(node.__key);
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('blockquote');
    addClassNamesToElement(element, config.theme.quote);
    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      blockquote: () => ({
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        conversion: convertBlockquoteElement,
        priority: 0,
      }),
    };
  }

  static importJSON(serializedNode: SerializedQuoteNode): QuoteNode {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const node = $createQuoteNode();
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'quote',
    };
  }

  // Mutation

  insertNewAfter(_: RangeSelection, restoreSelection?: boolean): ParagraphNode {
    const newBlock = $createParagraphNode();
    const direction = this.getDirection();
    newBlock.setDirection(direction);
    this.insertAfter(newBlock, restoreSelection);
    return newBlock;
  }

  collapseAtStart(): true {
    const paragraph = $createParagraphNode();
    const children = this.getChildren();
    children.forEach((child) => paragraph.append(child));
    this.replace(paragraph);
    return true;
  }
}

export function $createQuoteNode(): QuoteNode {
  return $applyNodeReplacement(new QuoteNode());
}

export function $isQuoteNode(node: LexicalNode | null | undefined): node is QuoteNode {
  return node instanceof QuoteNode;
}

function convertBlockquoteElement(): DOMConversionOutput {
  const node = $createQuoteNode();
  return { node };
}
