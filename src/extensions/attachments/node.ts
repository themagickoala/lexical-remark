/* eslint-disable @typescript-eslint/no-use-before-define */
import lexicalUtils from '@lexical/utils';
import lexical from 'lexical';

export type SerializedAttachmentNode = lexical.Spread<
  {
    filename: string;
    url: string;
  },
  lexical.SerializedElementNode
>;

function convertAttachmentElement(domNode: HTMLAnchorElement): lexical.DOMConversionOutput | null {
  return {
    node: $createAttachmentNode(domNode.getAttribute('href') ?? '', domNode.getAttribute('download') ?? ''),
  };
}

export class AttachmentNode extends lexical.ElementNode {
  __url: string;

  __filename: string;

  constructor(url: string, filename: string, key?: lexical.NodeKey) {
    super(key);
    this.__url = url;
    this.__filename = filename;
  }

  static getType(): string {
    return 'attachment';
  }

  static clone(node: AttachmentNode): AttachmentNode {
    return new AttachmentNode(node.__url, node.__filename, node.__key);
  }

  getURL(): string {
    return this.getLatest().__url;
  }

  setURL(url: string): void {
    const writable = this.getWritable();
    writable.__url = url;
  }

  getFilename(): string {
    return this.getLatest().__filename;
  }

  setFilename(filename: string): void {
    const writable = this.getWritable();
    writable.__filename = filename;
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('a');
    dom.href = this.__url;
    dom.download = this.__filename;
    dom.title = `Download ${this.__filename}`;
    return dom;
  }

  updateDOM(prevNode: AttachmentNode, dom: HTMLAnchorElement): boolean {
    if (prevNode.__url !== this.__url) {
      dom.href = this.__url;
    }

    if (prevNode.__filename !== this.__filename) {
      dom.download = this.__filename;
      dom.title = `Download ${this.__filename}`;
    }

    return false;
  }

  static importDOM(): lexical.DOMConversionMap<HTMLAnchorElement> | null {
    return {
      a: (domNode) => {
        if (!lexicalUtils.isHTMLAnchorElement(domNode)) {
          return null;
        }

        if (!domNode.getAttribute('download')) {
          return null;
        }
        return {
          conversion: convertAttachmentElement,
          priority: lexical.COMMAND_PRIORITY_HIGH,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedAttachmentNode): AttachmentNode {
    const node = $createAttachmentNode(serializedNode.url, serializedNode.filename);
    return node;
  }

  exportJSON(): SerializedAttachmentNode {
    return {
      ...super.exportJSON(),
      filename: this.getFilename(),
      type: 'attachment',
      url: this.getURL(),
      version: 1,
    };
  }
}

export function $createAttachmentNode(url: string, filename: string, key?: lexical.NodeKey): AttachmentNode {
  return new AttachmentNode(url, filename, key);
}

export function $isAttachmentNode(node: lexical.LexicalNode): node is AttachmentNode {
  return node instanceof AttachmentNode;
}
