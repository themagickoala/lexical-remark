import { DecoratorNode, TextFormatType, ElementNode } from "lexical";
import { Content, Parent } from "mdast";
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

export type Handler<
  NodeType extends Parent | Content = Parent | Content,
  IsParentRequired extends boolean = false,
> = (node: NodeType, { rootHandler, parent, formatting }: {
  rootHandler: Handler,
  formatting?: TextFormatType[],
} & (IsParentRequired extends true ? { parent: ElementNode } : { parent?: ElementNode })) => DecoratorNode<any> | ElementNode | ElementNode[] | void;

export const importFromRemarkTree = (tree: Parent | Content, handlers: Record<string, Handler>) => {
  const handle: Handler = (node, args) => {
    return zwitch('type', {
      handlers: {
        blockquote,
        break: hardBreak,
        code,
        emphasis,
        hardBreak,
        heading,
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
        ...handlers,
      },
      unknown: (_node, _args) => console.log('unknown node type'),
      invalid: (node) => console.log('invalid node type', node),
    })(node, args);
  };

  return handle(tree, { rootHandler: handle });
};