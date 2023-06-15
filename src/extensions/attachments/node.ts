/* eslint-disable @typescript-eslint/no-use-before-define */
import lexicalLink from '@lexical/link';
import lexicalUtils from '@lexical/utils';
import lexical from 'lexical';

export type SerializedAttachmentNode = lexical.Spread<
  {
    filename: string;
  },
  lexicalLink.SerializedLinkNode
>;

function convertAttachmentElement(domNode: HTMLElement): lexical.DOMConversionOutput | null {
  return {
    node: $createAttachmentNode(domNode.getAttribute('href') ?? '', domNode.getAttribute('download') ?? '', {
      rel: domNode.getAttribute('rel'),
      target: domNode.getAttribute('target'),
      title: domNode.getAttribute('title'),
    }),
  };
}

export class AttachmentNode extends lexicalLink.LinkNode {
  __filename: string;

  constructor(url: string, filename: string, attributes = {}, key?: lexical.NodeKey) {
    super(url, attributes, key);
    this.__url = url;
    this.__filename = filename;
  }

  static getType(): string {
    return 'attachment';
  }

  static clone(node: AttachmentNode): AttachmentNode {
    return new AttachmentNode(
      node.__url,
      node.__filename,
      {
        rel: node.__rel,
        target: node.__target,
        title: node.__title,
      },
      node.__key,
    );
  }

  createDOM(config: lexical.EditorConfig): HTMLAnchorElement {
    const dom = super.createDOM(config);
    dom.download = this.__filename;
    return dom;
  }

  updateDOM(prevNode: lexicalLink.LinkNode, dom: HTMLAnchorElement, config: lexical.EditorConfig): boolean {
    super.updateDOM(prevNode, dom, config);

    if (prevNode.__filename !== this.__filename) {
      dom.download = this.__filename;
    }

    return false;
  }

  static importDOM(): lexical.DOMConversionMap {
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
    const node = $createAttachmentNode(serializedNode.url, serializedNode.filename, {
      rel: serializedNode.rel,
      target: serializedNode.target,
      title: serializedNode.title,
    });
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedAttachmentNode {
    return {
      ...super.exportJSON(),
      filename: this.getFilename(),
      type: 'attachment',
      version: 1,
    };
  }

  getFilename(): string {
    return this.getLatest().__filename;
  }

  setFilename(filename: string): void {
    const writable = this.getWritable();
    writable.__filename = filename;
  }
}

export function $createAttachmentNode(
  url: string,
  filename: string,
  attributes = {},
  key?: lexical.NodeKey,
): AttachmentNode {
  return new AttachmentNode(url, filename, attributes, key);
}

export function $isAttachmentNode(node: lexical.LexicalNode): node is AttachmentNode {
  return node instanceof AttachmentNode;
}
