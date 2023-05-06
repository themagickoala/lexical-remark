import { DecoratorNode, TextFormatType, ElementNode } from "lexical";
import { Content, Parent } from "mdast";
import { zwitch } from "zwitch";
import { blockquote } from "./blockquote";
import { hardBreak } from "./break";
import { code } from "./code";
import { emphasis } from "./emphasis";
import { heading } from "./heading";
import { inlineCode } from "./inlineCode";
import { link } from "./link";
import { list } from "./list";
import { listItem } from "./listitem";
import { paragraph } from "./paragraph";
import { root } from "./root";
import { strong } from "./strong";
import { text } from "./text";
import { thematicBreak } from "./thematicBreak";

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
        // image: () => undefined,
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