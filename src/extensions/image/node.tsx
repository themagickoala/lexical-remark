import lexical from 'lexical';
import type { DOMExportOutput, EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode, Spread, DOMConversionMap } from 'lexical';
import { lazy, Suspense } from 'react';
import { isHTMLElement } from '@lexical/utils';

const ImageComponent = lazy(() => import('./component.js'));

export interface ImagePayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  src: string;
  width?: number;
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    src: string;
    type: 'image';
    version: 1;
    width?: number;
  },
  SerializedLexicalNode
>;

// istanbul ignore next: not possible to reliably test with jest
export class ImageNode extends lexical.DecoratorNode<JSX.Element> {
  __src: string;

  __altText: string;

  __width: 'inherit' | number;

  __height: 'inherit' | number;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, src, width } = serializedNode;

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return $createImageNode({
      altText,
      height,
      src,
      width,
    });
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: (domNode) => {
          const altText = isHTMLElement(domNode) ? domNode.getAttribute('alt') ?? '' : '';
          const src = isHTMLElement(domNode) ? domNode.getAttribute('src') ?? '' : '';
          return { node: $createImageNode({ altText, src }) };
        },
        priority: 1,
      })
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);
    element.setAttribute('width', this.__width.toString());
    element.setAttribute('height', this.__height.toString());
    return { element };
  }

  constructor(src: string, altText: string, width?: 'inherit' | number, height?: 'inherit' | number, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;

    if (className !== undefined) {
      span.className = className;
    }

    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <ImageComponent
          altText={this.__altText}
          height={this.__height}
          nodeKey={this.getKey()}
          src={this.__src}
          width={this.__width}
        />
      </Suspense>
    );
  }
}

// istanbul ignore next: not possible to reliably test with jest
export function $createImageNode({ altText, height, key, src, width }: ImagePayload): ImageNode {
  return lexical.$applyNodeReplacement(new ImageNode(src, altText, width, height, key));
}

// istanbul ignore next: not possible to reliably test with jest
export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
