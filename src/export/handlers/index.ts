import { LexicalNode } from "lexical";
import { Content, Parent } from "mdast";
import { zwitchFunc } from "../../utils/zwitch-func";
import { code } from "./code";
import { heading } from "./heading";
import { horizontalrule } from "./horizontalrule";
import { linebreak } from "./linebreak";
import { link } from "./link";
import { list } from "./list";
import { listitem } from "./listitem";
import { paragraph } from "./paragraph";
import { quote } from "./quote";
import { root } from "./root";
import { text } from "./text";

export type Handler<
  NodeType extends LexicalNode = LexicalNode,
> = (node: NodeType, { rootHandler }: {
  rootHandler: Handler,
}) => Parent | Content | void;

export const exportToRemarkTree = (tree: LexicalNode, { handlers = {} }: { handlers?: Record<string, Handler> }) => {
  const handle: Handler = (node, args) => {
    return zwitchFunc('getType', {
      handlers: {
        code,
        quote,
        linebreak,
        paragraph,
        text,
        heading,
        link,
        list,
        listitem,
        root,
        horizontalrule,
        ...handlers,
      },
      unknown: (_node, _args) => console.log('unknown node type'),
      invalid: (node) => console.log('invalid node type', node),
    })(node, args);
  };

  return handle(tree, { rootHandler: handle });
};