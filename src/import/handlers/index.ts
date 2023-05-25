import type { DecoratorNode, TextFormatType, ElementNode, LexicalNode } from "lexical";
import { Node } from "../../types.js";
import { zwitch } from "zwitch";
import { blockquote } from "./blockquote.js";
import { hardBreak } from "./break.js";
import { code } from "./code.js";
import { emphasis } from "./emphasis.js";
import { heading } from "./heading.js";
import { image } from "./image.js";
import { inlineCode } from "./inlineCode.js";
import { link } from "./link.js";
import { list } from "./list.js";
import { listItem } from "./listitem.js";
import { paragraph } from "./paragraph.js";
import { root } from "./root.js";
import { strong } from "./strong.js";
import { text } from "./text.js";
import { thematicBreak } from "./thematicBreak.js";
import { youtube } from "./youtube.js";
import { html } from "./html.js";
import { CollapsibleContainerNode } from "../../extensions/collapsible/container/node.js";

export type Handler<
  NodeType extends Node = Node,
  IsParentRequired extends boolean = false,
> = (node: NodeType, { rootHandler, parent, formatting }: {
  rootHandler: Handler,
  formatting?: TextFormatType[],
  state: {
    openDetailsNodesMap: { parent?: ElementNode, details: CollapsibleContainerNode }[],
  },
} & (IsParentRequired extends true ? { parent: ElementNode } : { parent?: ElementNode })) => DecoratorNode<any> | ElementNode | ElementNode[] | void;

export const importFromRemarkTree = (tree: Node, handlers: Record<string, Handler>) => {
  const handle: Handler = (node, args) => {
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
        ...handlers,
      },
      unknown: (_node, _args) => console.log('unknown node type'),
      invalid: (node) => console.log('invalid node type', node),
    })(node, args);
  };

  return handle(tree, { rootHandler: handle, state: { openDetailsNodesMap: [] } });
};