import { LexicalNode, RootNode, TextFormatType } from "lexical";
import { Node } from "../types.js";
import { zwitch } from "zwitch";
import { blockquote } from "./handlers/blockquote.js";
import { hardBreak } from "./handlers/break.js";
import { code } from "./handlers/code.js";
import { emphasis } from "./handlers/emphasis.js";
import { heading } from "./handlers/heading.js";
import { image } from "./handlers/image.js";
import { inlineCode } from "./handlers/inlineCode.js";
import { link } from "./handlers/link.js";
import { list } from "./handlers/list.js";
import { listItem } from "./handlers/listitem.js";
import { paragraph } from "./handlers/paragraph.js";
import { root } from "./handlers/root.js";
import { strong } from "./handlers/strong.js";
import { text } from "./handlers/text.js";
import { thematicBreak } from "./handlers/thematicBreak.js";
import { youtube } from "./handlers/youtube.js";
import { html } from "./handlers/html.js";
import { Root } from "mdast";

export type Handler<
  TNodeType extends Node = Node,
> = (node: TNodeType, parser: Parser) => TNodeType extends Root ? RootNode : void;

export class Parser {
  stack: LexicalNode[] = [];
  formatting: TextFormatType[] = [];
  handlers: Record<string, Handler>;

  constructor(handlers?: Record<string, Handler>) {
    this.handlers = handlers ?? {};
  }

  parse<TNodeType extends Node = Node>(tree: TNodeType): TNodeType extends Root ? RootNode : void {
    return zwitch('type', {
      handlers: {
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
      unknown: (_node, _parser) => console.log('unknown node type'),
      invalid: (node) => console.log('invalid node type', node),
    })(tree, this) as TNodeType extends Root ? RootNode : void;
  }

  append(node: LexicalNode) {
    if (this.stack.length === 0) {
      throw new Error('Cannot append node to empty stack');
    }
    const parent = this.stack[this.stack.length - 1];
    parent.append(node);
  }
}