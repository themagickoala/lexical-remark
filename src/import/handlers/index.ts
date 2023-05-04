import { TextFormatType } from "lexical";
import { DecoratorNode } from "lexical";
import { ElementNode } from "lexical";
import { Content, Parent } from "mdast";
import { zwitch } from "zwitch";
import { blockquote } from "./blockquote";
import { hardBreak } from "./break";
import { emphasis } from "./emphasis";
import { heading } from "./heading";
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
        code: () => undefined,
        // definition: () => undefined,
        emphasis,
        hardBreak,
        heading,
        // html: () => undefined,
        // image: () => undefined,
        // imageReference: () => undefined,
        inlineCode: () => undefined,
        link,
        // linkReference: () => undefined,
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