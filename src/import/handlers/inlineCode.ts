import lexical from "lexical";
import { InlineCode } from "mdast";
import { Handler } from "../parser.js";

export const inlineCode: Handler<InlineCode> = (node, parser) => {
  const lexicalNode = lexical.$createTextNode(node.value);
  lexicalNode.toggleFormat('code');
  parser.append(lexicalNode);
};