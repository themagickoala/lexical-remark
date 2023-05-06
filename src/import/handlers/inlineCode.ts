import { $createTextNode } from "lexical";
import { InlineCode } from "mdast";
import { Handler } from ".";

export const inlineCode: Handler<InlineCode, true> = (node, { parent }) => {
  const lexicalNode = $createTextNode(node.value);
  lexicalNode.toggleFormat('code');
  parent.append(lexicalNode);
};