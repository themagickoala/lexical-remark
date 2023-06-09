import { LexicalNode, RootNode, TextFormatType } from 'lexical';
import { Root } from 'mdast';
import { zwitch } from 'zwitch';

import { DummyRootNode } from '../extensions/collapsible/dummyRoot/node.js';
import { Node } from '../types.js';
import { attachment } from './handlers/attachment.js';
import { blockquote } from './handlers/blockquote.js';
import { hardBreak } from './handlers/break.js';
import { code } from './handlers/code.js';
import { emphasis } from './handlers/emphasis.js';
import { heading } from './handlers/heading.js';
import { html } from './handlers/html.js';
import { image } from './handlers/image.js';
import { inlineCode } from './handlers/inlineCode.js';
import { link } from './handlers/link.js';
import { list } from './handlers/list.js';
import { listItem } from './handlers/listitem.js';
import { paragraph } from './handlers/paragraph.js';
import { root } from './handlers/root.js';
import { strong } from './handlers/strong.js';
import { text } from './handlers/text.js';
import { thematicBreak } from './handlers/thematicBreak.js';
import { youtube } from './handlers/youtube.js';

export type Handler<TNodeType extends Node = Node> = (
  node: TNodeType,
  parser: Parser,
) => TNodeType extends Root ? RootNode | DummyRootNode : void;

export class Parser {
  stack: (LexicalNode | DummyRootNode)[] = [];

  formatting: TextFormatType[] = [];

  handlers: Record<string, Handler>;

  constructor(handlers?: Record<string, Handler>) {
    this.handlers = handlers ?? {};
  }

  parse<TNodeType extends Node = Node>(tree: TNodeType): TNodeType extends Root ? RootNode : void {
    return zwitch('type', {
      handlers: {
        attachment,
        blockquote,
        break: hardBreak,
        code,
        emphasis,
        hardBreak,
        heading,
        html,
        image,
        inlineCode,
        link,
        list,
        listItem,
        paragraph,
        root,
        strong,
        text,
        thematicBreak,
        youtube,
        ...this.handlers,
      },
      invalid: (node) => console.log('invalid node type', node),
      unknown: (_node, _parser) => console.log('unknown node type'),
    })(tree, this) as TNodeType extends Root ? RootNode : void;
  }

  pop(
    node?: LexicalNode | DummyRootNode | ((l: LexicalNode) => boolean) | string,
  ): LexicalNode | DummyRootNode | undefined {
    const returnNode = this.stack.pop();
    if (!returnNode) {
      throw new Error('Cannot pop from empty stack');
    }
    if (typeof node === 'function') {
      if (!node(returnNode as any)) {
        console.log({ node, returnNode });
        throw new Error('Popped node does not match expected typeguard');
      }
    } else if (typeof node === 'string') {
      if ((returnNode as any).getType?.() !== node) {
        console.log({ node, returnNode });
        throw new Error('Popped node does not match expected type');
      }
    } else if (node && node !== returnNode) {
      console.log({ node, returnNode });
      throw new Error('Popped node does not match expected node');
    }
    return returnNode;
  }

  push(node: LexicalNode | DummyRootNode) {
    this.stack.push(node);
  }

  append(node: LexicalNode) {
    if (this.stack.length === 0) {
      console.log({ node });
      throw new Error('Cannot append node to empty stack');
    }
    const parent = this.stack[this.stack.length - 1];
    parent.append(node);
  }
}
